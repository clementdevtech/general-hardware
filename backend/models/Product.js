import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true }, // Unique stock-keeping unit
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Cement",
        "Steel",
        "Paints",
        "Plumbing",
        "Electrical",
        "Timber",
        "Tools",
        "Fasteners",
        "Tiles",
        "Roofing",
        "Safety Gear",
        "Others",
      ],
    },
    brand: { type: String },
    description: { type: String },
    unit: {
      type: String,
      enum: [
        "kg",
        "litre",
        "piece",
        "packet",
        "roll",
        "bag",
        "set",
        "meter",
        "square_meter",
      ],
      required: true,
    },
    size: { type: String }, // e.g. "50kg bag", "2-inch pipe", "1L can"
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // Optional discount %
    stock: { type: Number, default: 0 }, // Inventory quantity
    reorderLevel: { type: Number, default: 10 }, // Low-stock threshold
    supplier: {
      name: String,
      contact: String,
    },
    location: { type: String, default: "Main Store" },
    image: { type: String }, // main image
    images: [String], // optional multiple images
    tags: [String], // searchable tags like “waterproof”, “industrial use”, etc.
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Discontinued"],
      default: "In Stock",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
