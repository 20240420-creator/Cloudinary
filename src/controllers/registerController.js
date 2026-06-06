import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import userModel from "../models/user.js";
import { config } from "../../config.js";
import HTMLVerificationEmail from "../utils/HTMLVerificationEmail.js";

// Array de funciones del controlador
const registerController = {};

// =============================================
// PASO 1: Registrar usuario y enviar código
// =============================================
registerController.register = async (req, res) => {
  try {
    //#1 - Solicitar los datos
    const { name, lastName, email, password } = req.body;

    //#2 - Validaciones
    if (!name || !lastName || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener mínimo 6 caracteres" });
    }

    //#3 - Verificar si el correo ya existe en la BD
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    //#4 - Encriptar la contraseña
    const passwordHashed = await bcryptjs.hash(password, 10);

    //#5 - Generar código aleatorio de 6 caracteres
    const randomCode = crypto.randomBytes(3).toString("hex");

    //#6 - Guardar todo en un token (no en la BD todavía)
    const token = jsonwebtoken.sign(
      {
        randomCode,
        name,
        lastName,
        email,
        password: passwordHashed,
      },
      config.JWT.secret,
      { expiresIn: "15m" }
    );

    //#7 - Guardar el token en una cookie (httpOnly para seguridad)
    res.cookie("registrationCookie", token, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });

    //#8 - Enviar correo electrónico con el código
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
      subject: "Verificación de cuenta",
      html: HTMLVerificationEmail(randomCode, name),
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Correo de verificación enviado" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// =============================================
// PASO 2: Verificar el código y guardar en BD
// =============================================
registerController.verifyCode = async (req, res) => {
  try {
    //#1 - Obtener el código que escribió el usuario
    const { verificationCode } = req.body;

    if (!verificationCode) {
      return res.status(400).json({ message: "El código es obligatorio" });
    }

    //#2 - Obtener el token de la cookie
    const token = req.cookies.registrationCookie;

    if (!token) {
      return res.status(400).json({ message: "No hay cookie de registro. Vuelve a registrarte" });
    }

    //#3 - Decodificar el token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const { randomCode, name, lastName, email, password } = decoded;

    //#4 - Comparar los códigos
    if (verificationCode !== randomCode) {
      return res.status(400).json({ message: "Código incorrecto" });
    }

    //#5 - Si el código es correcto, guardar el usuario en la BD
    const newUser = new userModel({
      name,
      lastName,
      email,
      password,
      isVerified: true,
    });

    await newUser.save();

    //#6 - Borrar la cookie de registro
    res.clearCookie("registrationCookie");

    return res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default registerController;
