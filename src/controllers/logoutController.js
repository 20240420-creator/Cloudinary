// Array de funciones del controlador
const logoutController = {};

// =============================================
// CERRAR SESION
// =============================================
logoutController.logout = (req, res) => {
  try {
    //#1 - Borrar la cookie de autenticación
    //     Las opciones deben coincidir exactamente con las usadas al crearla
    res.clearCookie("authCookie", {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default logoutController;
