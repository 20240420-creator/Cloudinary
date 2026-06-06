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
      updateData.profileImage = req.file.path;
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
// CRUD CON ARRAYS - DIRECCIONES DEL USUARIO
// =============================================

// POST - Agregar una dirección al array
userController.addAddress = async (req, res) => {
  try {
    const { street, city, state, zipCode, isDefault } = req.body;

    if (!street || !city || !state || !zipCode) {
      return res.status(400).json({ message: "street, city, state y zipCode son obligatorios" });
    }

    const newAddress = { street, city, state, zipCode, isDefault: isDefault || false };

    // $push agrega el objeto al array de addresses
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { $push: { addresses: newAddress } },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({ message: "Dirección agregada", addresses: user.addresses });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET - Obtener todas las direcciones de un usuario
userController.getAddresses = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select("addresses");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// PUT - Editar una dirección específica del array (por su _id)
userController.updateAddress = async (req, res) => {
  try {
    const { street, city, state, zipCode, isDefault } = req.body;
    const { id, addressId } = req.params;

    // addresses.$ actualiza el subdocumento que coincide con el filtro
    const user = await userModel.findOneAndUpdate(
      { _id: id, "addresses._id": addressId },
      {
        $set: {
          "addresses.$.street": street,
          "addresses.$.city": city,
          "addresses.$.state": state,
          "addresses.$.zipCode": zipCode,
          "addresses.$.isDefault": isDefault,
        },
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario o dirección no encontrada" });
    }

    return res.status(200).json({ message: "Dirección actualizada", addresses: user.addresses });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// DELETE - Eliminar una dirección del array (por su _id)
userController.deleteAddress = async (req, res) => {
  try {
    const { id, addressId } = req.params;

    // $pull elimina el subdocumento que coincide con el _id
    const user = await userModel.findByIdAndUpdate(
      id,
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({ message: "Dirección eliminada", addresses: user.addresses });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default userController;
