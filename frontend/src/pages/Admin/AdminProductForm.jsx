import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api";

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ---------- State ----------
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [unit, setUnit] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [stock, setStock] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierContact, setSupplierContact] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState("In Stock");

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // ---------- Categories & Units ----------
  const categories = [
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
  ];

  const units = [
    "kg",
    "litre",
    "piece",
    "packet",
    "roll",
    "bag",
    "set",
    "meter",
    "square_meter",
  ];

  // ---------- Fetch existing product (edit mode) ----------
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await API.get(`/products/${id}`);
          const data = res.data;

          setSku(data.sku || "");
          setName(data.name || "");
          setCategory(data.category || "");
          setBrand(data.brand || "");
          setUnit(data.unit || "");
          setSize(data.size || "");
          setPrice(data.price || "");
          setDiscount(data.discount || "");
          setStock(data.stock || "");
          setReorderLevel(data.reorderLevel || "");
          setSupplierName(data.supplier?.name || "");
          setSupplierContact(data.supplier?.contact || "");
          setLocation(data.location || "");
          setDescription(data.description || "");
          setTags((data.tags || []).join(", "));
          setIsFeatured(data.isFeatured || false);
          setStatus(data.status || "In Stock");
          setExistingImages(data.images || []);
        } catch (err) {
          console.error("Error loading product:", err);
        }
      };
      fetchProduct();
    }
  }, [id]);

  // ---------- Image upload & preview ----------
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 4 * 1024 * 1024;
    const validFiles = [];
    const previews = [];

    files.forEach((file) => {
      if (file.size > maxSize) {
        alert(`"${file.name}" is too large! (max 4MB)`);
      } else {
        validFiles.push(file);
        previews.push(URL.createObjectURL(file));
      }
    });

    setImages(validFiles);
    setImagePreviews(previews);
  };

  // ---------- Submit Form ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("sku", sku);
    formData.append("name", name);
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("unit", unit);
    formData.append("size", size);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("stock", stock);
    formData.append("reorderLevel", reorderLevel);
    formData.append("supplierName", supplierName);
    formData.append("supplierContact", supplierContact);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("isFeatured", isFeatured);
    formData.append("status", status);

    // Parse tags
    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    formData.append("tags", JSON.stringify(tagsArray));

    // Add images
    images.forEach((img) => formData.append("images", img));

    try {
      if (id) {
        await API.put(`/products/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate("/admin/products");
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Something went wrong while saving the product.");
    }
  };

  // ---------- Render ----------
  return (
    <div className="container py-3">
      <h2 className="mb-4">{id ? "Edit Product" : "New Product"}</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* SKU */}
        <div className="mb-3">
          <label className="form-label">SKU</label>
          <input
            type="text"
            className="form-control"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
          />
        </div>

        {/* Name */}
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div className="mb-3">
          <label className="form-label">Brand</label>
          <input
            type="text"
            className="form-control"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>

        {/* Unit */}
        <div className="mb-3">
          <label className="form-label">Unit</label>
          <select
            className="form-select"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          >
            <option value="">-- Select Unit --</option>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        {/* Size */}
        <div className="mb-3">
          <label className="form-label">Size</label>
          <input
            type="text"
            className="form-control"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="e.g. 50kg, 2-inch pipe, 1L"
          />
        </div>

        {/* Price / Discount */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Price (Ksh)</label>
            <input
              type="number"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Discount (%)</label>
            <input
              type="number"
              className="form-control"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
        </div>

        {/* Stock / Reorder */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Stock</label>
            <input
              type="number"
              className="form-control"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Reorder Level</label>
            <input
              type="number"
              className="form-control"
              value={reorderLevel}
              onChange={(e) => setReorderLevel(e.target.value)}
            />
          </div>
        </div>

        {/* Supplier Info */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Supplier Name</label>
            <input
              type="text"
              className="form-control"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Supplier Contact</label>
            <input
              type="text"
              className="form-control"
              value={supplierContact}
              onChange={(e) => setSupplierContact(e.target.value)}
            />
          </div>
        </div>

        {/* Location */}
        <div className="mb-3">
          <label className="form-label">Storage Location</label>
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Warehouse A, Store B"
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Tags */}
        <div className="mb-3">
          <label className="form-label">Tags (comma-separated)</label>
          <input
            type="text"
            className="form-control"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. waterproof, industrial, heavy-duty"
          />
        </div>

        {/* Featured & Status */}
        <div className="row mb-3">
          <div className="col-md-6 form-check mt-4">
            <input
              type="checkbox"
              className="form-check-input"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            <label className="form-check-label">Featured Product</label>
          </div>

          <div className="col-md-6">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>In Stock</option>
              <option>Out of Stock</option>
              <option>Discontinued</option>
            </select>
          </div>
        </div>

        {/* Images */}
        <div className="mb-3">
          <label className="form-label">Upload Images (max 4MB each)</label>
          <input
            type="file"
            className="form-control"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          {/* New Previews */}
          {imagePreviews.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mt-3">
              {imagePreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt="preview"
                  style={{
                    width: "120px",
                    height: "90px",
                    objectFit: "cover",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                  }}
                />
              ))}
            </div>
          )}
          {/* Existing Images */}
          {id && existingImages.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mt-3">
              {existingImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="product"
                  style={{
                    width: "120px",
                    height: "90px",
                    objectFit: "cover",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                  }}
                />
              ))}
            </div>
          )}
          <small className="text-muted d-block mt-2">
            Uploading new images will replace existing ones.
          </small>
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-success">
          {id ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}