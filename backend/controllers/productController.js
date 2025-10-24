import Product from "../models/Product.js";

// Utility: convert image buffer → base64 string
const bufferToBase64 = (buffer, mimetype) =>
  `data:${mimetype};base64,${buffer.toString("base64")}`;

// ------------------ Get all products ------------------
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ Get single product ------------------
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ Add product ------------------
export const addProduct = async (req, res) => {
  try {
    const {
      sku,
      name,
      category,
      brand,
      description,
      price,
      discount,
      unit,
      size,
      stock,
      reorderLevel,
      supplierName,
      supplierContact,
      location,
      tags,
      isFeatured,
    } = req.body;

    // Parse tags if given as a comma-separated string
    let tagArray = [];
    if (typeof tags === "string") {
      tagArray = tags.split(",").map((t) => t.trim()).filter((t) => t);
    } else if (Array.isArray(tags)) {
      tagArray = tags;
    }

    // Handle images
    let images = [];
    if (req.files?.images) {
      images = req.files.images.map((file) =>
        bufferToBase64(file.buffer, file.mimetype)
      );
    }

    const coverImage = images[0] || "";

    const product = new Product({
      sku,
      name,
      category,
      brand,
      description,
      unit,
      size,
      price,
      discount: discount || 0,
      stock: stock || 0,
      reorderLevel: reorderLevel || 10,
      supplier: {
        name: supplierName,
        contact: supplierContact,
      },
      location: location || "Main Store",
      image: coverImage,
      images,
      tags: tagArray,
      isFeatured: isFeatured || false,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
};

// ------------------ Update product ------------------
export const updateProduct = async (req, res) => {
  try {
    const {
      sku,
      name,
      category,
      brand,
      description,
      price,
      discount,
      unit,
      size,
      stock,
      reorderLevel,
      supplierName,
      supplierContact,
      location,
      tags,
      isFeatured,
      status,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update fields only if provided
    if (sku) product.sku = sku;
    if (name) product.name = name;
    if (category) product.category = category;
    if (brand) product.brand = brand;
    if (description) product.description = description;
    if (price) product.price = price;
    if (discount) product.discount = discount;
    if (unit) product.unit = unit;
    if (size) product.size = size;
    if (stock) product.stock = stock;
    if (reorderLevel) product.reorderLevel = reorderLevel;
    if (location) product.location = location;
    if (typeof isFeatured !== "undefined") product.isFeatured = isFeatured;
    if (status) product.status = status;

    if (supplierName || supplierContact) {
      product.supplier = {
        name: supplierName || product.supplier?.name,
        contact: supplierContact || product.supplier?.contact,
      };
    }

    // Update tags
    if (tags) {
      const tagArray =
        typeof tags === "string"
          ? tags.split(",").map((t) => t.trim()).filter((t) => t)
          : tags;
      product.tags = tagArray;
    }

    // Replace images if new ones uploaded
    if (req.files?.images && req.files.images.length > 0) {
      const newImages = req.files.images.map((file) =>
        bufferToBase64(file.buffer, file.mimetype)
      );
      product.images = newImages;
      product.image = newImages[0] || product.image;
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};

// ------------------ Delete product ------------------
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Server error" });
  }
};