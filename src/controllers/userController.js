import userModel from "../models/user.js";

// Array de funciones del controlador
const userController = {};

// =============================================
// CRUD BASICO DE USUARIOS
// =============================================

// GET - Obtener todos los usuarios
userController.getUsers = async (req, res) => {
  try {
    // No devolvemos la contraseña por seguridad
    const users = await userModel.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET - Obtener un usuario por ID
userController.getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// PUT - Actualizar datos del usuario (con foto de perfil en Cloudinary)
userController.updateUser = async (req, res) => {
  try {
    const { name, lastName } = req.body;

    // Solo incluir los campos que realmente se enviaron
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (lastName !== undefined) updateData.lastName = lastName;

    // Si se subió una imagen, guardar la URL de Cloudinary
    if (req.file) {
      updateData.profilePhoto = req.file.path;
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({ message: "Usuario actualizado", user: updatedUser });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// DELETE - Eliminar un usuario
userController.deleteUser = async (req, res) => {
  try {
    const deleted = await userModel.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// =============================================
// CRUD CON ARRAYS - CONTACTOS DE EMERGENCIA
// =============================================

// POST - Agregar un contacto al array
userController.addEmergencyContact = async (req, res) => {
  try {
    const { phone, nameEmergencyContact } = req.body;

    if (!phone || !nameEmergencyContact) {
      return res.status(400).json({ message: "phone y nameEmergencyContact son obligatorios" });
    }

    const newContact = { phone, nameEmergencyContact };

    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { $push: { phoneEmergencyContacts: newContact } },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({ message: "Contacto agregado", phoneEmergencyContacts: user.phoneEmergencyContacts });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET - Obtener todos los contactos de emergencia de un usuario
userController.getEmergencyContacts = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select("phoneEmergencyContacts");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({ phoneEmergencyContacts: user.phoneEmergencyContacts });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// PUT - Editar un contacto específico del array (por su _id)
userController.updateEmergencyContact = async (req, res) => {
  try {
    const { phone, nameEmergencyContact } = req.body;
    const { id, contactId } = req.params;

    const user = await userModel.findOneAndUpdate(
      { _id: id, "phoneEmergencyContacts._id": contactId },
      {
        $set: {
          "phoneEmergencyContacts.$.phone": phone,
          "phoneEmergencyContacts.$.nameEmergencyContact": nameEmergencyContact,
        },
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario o contacto no encontrado" });
    }

    return res.status(200).json({ message: "Contacto actualizado", phoneEmergencyContacts: user.phoneEmergencyContacts });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// DELETE - Eliminar un contacto del array (por su _id)
userController.deleteEmergencyContact = async (req, res) => {
  try {
    const { id, contactId } = req.params;

    const user = await userModel.findByIdAndUpdate(
      id,
      { $pull: { phoneEmergencyContacts: { _id: contactId } } },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({ message: "Contacto eliminado", phoneEmergencyContacts: user.phoneEmergencyContacts });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default userController;
