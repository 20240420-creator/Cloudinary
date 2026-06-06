import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

import { config } from "../../config.js";
import userModel from "../models/user.js";
import HTMLRecoveryEmail from "../utils/HTMLRecoveryEmail.js";

// Array de funciones del controlador
const recoveryPasswordController = {};

// =============================================
// PASO 1: Solicitar código de recuperación
// =============================================
recoveryPasswordController.requestCode = async (req, res) => {
  try {
    //#1 - Solicitar el correo
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "El correo es obligatorio" });
    }

    //#2 - Verificar si el correo existe en la BD
    const userFound = await userModel.findOne({ email });

    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    //#3 - Generar un código aleatorio
    const randomCode = crypto.randomBytes(3).toString("hex");

    //#4 - Guardar en un token
    const token = jsonwebtoken.sign(
      { email, randomCode, verified: false },
      config.JWT.secret,
      { expiresIn: "15m" }
    );

    //#5 - Guardar el token en una cookie (httpOnly para seguridad)
    res.cookie("recoveryCookie", token, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });

    //#6 - Enviar el código por correo electrónico (con HTML)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

    const mailOptions = {
      from: config.email.user_email,
      to: email,
      subject: "Recuperación de contraseña",
      html: HTMLRecoveryEmail(randomCode),
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Código de recuperación enviado al correo" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// =============================================
// PASO 2: Verificar el código
// =============================================
recoveryPasswordController.verifyCode = async (req, res) => {
  try {
    //#1 - Solicitar el código que escribió el usuario
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "El código es obligatorio" });
    }

    //#2 - Obtener el token de la cookie
    const token = req.cookies.recoveryCookie;

    if (!token) {
      return res.status(400).json({ message: "No hay cookie de recuperación. Solicita el código de nuevo" });
    }

    //#3 - Decodificar el token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    //#4 - Comparar los códigos
    if (code !== decoded.randomCode) {
      return res.status(400).json({ message: "Código incorrecto" });
    }

    //#5 - Crear un nuevo token con verified: true
    const newToken = jsonwebtoken.sign(
      { email: decoded.email, verified: true },
      config.JWT.secret,
      { expiresIn: "15m" }
    );

    //#6 - Actualizar la cookie con el nuevo token (httpOnly)
    res.cookie("recoveryCookie", newToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Código verificado correctamente" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// =============================================
// PASO 3: Cambiar la contraseña
// =============================================
recoveryPasswordController.newPassword = async (req, res) => {
  try {
    //#1 - Solicitar las contraseñas
    const { newPassword, confirmNewPassword } = req.body;

    if (!newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "Ambas contraseñas son obligatorias" });
    }

    //#2 - Validar que las contraseñas coincidan
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener mínimo 6 caracteres" });
    }

    //#3 - Verificar que la cookie existe y que ya pasó por el paso 2
    const token = req.cookies.recoveryCookie;

    if (!token) {
      return res.status(400).json({ message: "No hay cookie de recuperación. Solicita el código de nuevo" });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (!decoded.verified) {
      return res.status(400).json({ message: "Primero debes verificar el código" });
    }

    //#4 - Encriptar la nueva contraseña
    const passwordHash = await bcrypt.hash(newPassword, 10);

    //#5 - Actualizar en la BD
    await userModel.findOneAndUpdate(
      { email: decoded.email },
      { password: passwordHash },
      { new: true }
    );

    //#6 - Borrar la cookie de recuperación
    res.clearCookie("recoveryCookie");

    return res.status(200).json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default recoveryPasswordController;
