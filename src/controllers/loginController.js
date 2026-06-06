import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import { config } from "../../config.js";
import userModel from "../models/user.js";

// Array de funciones del controlador
const loginController = {};

// =============================================
// INICIO DE SESION
// =============================================
loginController.login = async (req, res) => {
  try {
    //#1 - Solicitar los datos
    const { email, password } = req.body;

    //#2 - Validaciones
    if (!email || !password) {
      return res.status(400).json({ message: "El correo y la contraseña son obligatorios" });
    }

    //#3 - Verificar si el correo existe en la BD
    const userFound = await userModel.findOne({ email });

    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    //#4 - Verificar si la cuenta está verificada
    if (!userFound.isVerified) {
      return res.status(403).json({ message: "Debes verificar tu cuenta primero" });
    }

    //#5 - Verificar si la cuenta está bloqueada
    if (userFound.timeOut && userFound.timeOut > Date.now()) {
      const minutesLeft = Math.ceil((userFound.timeOut - Date.now()) / 60000);
      return res.status(403).json({
        message: `Cuenta bloqueada. Intenta en ${minutesLeft} minuto(s)`,
      });
    }

    //#6 - Validar la contraseña
    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
      //#7 - Sumar 1 intento fallido
      userFound.loginAttemps = (userFound.loginAttemps || 0) + 1;

      //#8 - Si llegó a 5 intentos, bloquear la cuenta por 5 minutos
      if (userFound.loginAttemps >= 5) {
        userFound.timeOut = Date.now() + 5 * 60 * 1000;
        userFound.loginAttemps = 0;
        await userFound.save();

        return res.status(403).json({
          message: "Cuenta bloqueada por 5 minutos por demasiados intentos fallidos",
        });
      }

      await userFound.save();

      return res.status(401).json({
        message: `Contraseña incorrecta. Intentos restantes: ${5 - userFound.loginAttemps}`,
      });
    }

    //#9 - Resetear los intentos si el login es exitoso
    userFound.loginAttemps = 0;
    userFound.timeOut = null;
    await userFound.save();

    //#10 - Generar el token JWT
    const token = jsonwebtoken.sign(
      { id: userFound._id, email: userFound.email, userType: "user" },
      config.JWT.secret,
      { expiresIn: "30d" }
    );

    //#11 - Guardar el token en una cookie (httpOnly evita que JS del frontend lo lea)
    res.cookie("authCookie", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Inicio de sesión exitoso" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default loginController;
