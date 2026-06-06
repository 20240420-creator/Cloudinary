import jsonwebtoken from "jsonwebtoken";
import { config } from "../../config.js";

const verifyToken = (req, res, next) => {
  try {
    // Obtener el token de la cookie
    const token = req.cookies.authCookie;

    if (!token) {
      return res.status(401).json({ message: "No hay token. Acceso denegado" });
    }

    // Verificar el token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export default verifyToken;
