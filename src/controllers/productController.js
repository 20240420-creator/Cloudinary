import productModel from "../models/product.js";

// Array de funciones del controlador
const productController = {};

// =============================================
// CRUD BASICO DE PRODUCTOS
// =============================================

// GET - Obtener todos los productos
productController.getProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    return res.status(200).json(products);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET - Obtener un producto por ID
productController.getProductById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// POST - Crear un producto (con imagen en Cloudinary)
productController.createProduct = async (req, res) => {
  try {
    //#1 - Solicitar los datos del body
    const { name, description, price, stock, category } = req.body;

    //#2 - Validaciones
    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({ message: "Todos los campos son obligatorios: name, description, price, stock, category" });
    }

    if (price <= 0) {
      return res.status(400).json({ message: "El precio debe ser mayor a 0" });
    }

    if (stock < 0) {
      return res.status(400).json({ message: "El stock no puede ser negativo" });
    }

    //#3 - Obtener la URL de la imagen si se subió una
    //     req.file.path contiene la URL de Cloudinary
    const imageUrl = req.file ? req.file.path : "";

    //#4 - Crear el nuevo producto
    const newProduct = new productModel({
      name,
      description,
      price,
      stock,
      category,
      imageUrl,
      tags: [], // Empieza con array vacío de tags
    });

    await newProduct.save();

    return res.status(201).json({ message: "Producto creado exitosamente", product: newProduct });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// PUT - Actualizar un producto
productController.updateProduct = async (req, res) => {
  try {
    //#1 - Solicitar los nuevos valores
    const { name, description, price, stock, category } = req.body;

    //#2 - Validaciones
    if (price !== undefined && price <= 0) {
      return res.status(400).json({ message: "El precio debe ser mayor a 0" });
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({ message: "El stock no puede ser negativo" });
    }

    //#3 - Solo incluir los campos que realmente se enviaron (evitar sobreescribir con undefined)
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (category !== undefined) updateData.category = category;
    if (req.file) updateData.imageUrl = req.file.path;

    //#4 - Actualizar en la BD
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.status(200).json({ message: "Producto actualizado", product: updatedProduct });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "ID de producto inválido" });
    }
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// DELETE - Eliminar un producto
productController.deleteProduct = async (req, res) => {
  try {
    const deleted = await productModel.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.status(200).json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// =============================================
// CRUD CON ARRAYS - TAGS DEL PRODUCTO
// =============================================

// POST - Agregar un tag al array
productController.addTag = async (req, res) => {
  try {
    const { tag } = req.body;

    if (!tag) {
      return res.status(400).json({ message: "El tag es obligatorio" });
    }

    // $push agrega el elemento al array
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      { $push: { tags: tag } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.status(200).json({ message: "Tag agregado", tags: product.tags });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET - Obtener todos los tags de un producto
productController.getTags = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.status(200).json({ tags: product.tags });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// PUT - Editar un tag específico del array
productController.updateTag = async (req, res) => {
  try {
    const { oldTag, newTag } = req.body;

    if (!oldTag || !newTag) {
      return res.status(400).json({ message: "oldTag y newTag son obligatorios" });
    }

    // $ referencia al elemento encontrado en el array
    const product = await productModel.findOneAndUpdate(
      { _id: req.params.id, tags: oldTag },
      { $set: { "tags.$": newTag } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Producto o tag no encontrado" });
    }

    return res.status(200).json({ message: "Tag actualizado", tags: product.tags });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// DELETE - Eliminar un tag del array
productController.deleteTag = async (req, res) => {
  try {
    const { tag } = req.body;

    if (!tag) {
      return res.status(400).json({ message: "El tag es obligatorio" });
    }

    // $pull elimina el elemento del array
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { tags: tag } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.status(200).json({ message: "Tag eliminado", tags: product.tags });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// =============================================
// BUSQUEDAS AVANZADAS
// =============================================

// GET - Obtener productos por categoría
productController.getByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await productModel.find({ category });

    return res.status(200).json(products);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// POST - Buscar por rango de precio
productController.getByPriceRange = async (req, res) => {
  try {
    const { min, max } = req.body;

    if (min === undefined || max === undefined) {
      return res.status(400).json({ message: "min y max son obligatorios" });
    }

    const products = await productModel.find({
      price: { $gte: min, $lte: max },
    });

    return res.status(200).json(products);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET - Obtener productos con stock bajo (menos de 5)
productController.getLowStock = async (req, res) => {
  try {
    const products = await productModel.find({ stock: { $lt: 5 } });
    return res.status(200).json(products);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// GET - Contar productos
productController.countProducts = async (req, res) => {
  try {
    const count = await productModel.countDocuments();
    return res.status(200).json({ total: count });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default productController;
