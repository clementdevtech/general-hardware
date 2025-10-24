import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { addProduct, getProduct, updateProduct } from "../../services/productService"
import AdminSidebar from "../../components/AdminSidebar"

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Product fields
  const [sku, setSku] = useState("")
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [brand, setBrand] = useState("")
  const [unit, setUnit] = useState("piece")
  const [size, setSize] = useState("")
  const [price, setPrice] = useState("")
  const [discount, setDiscount] = useState("")
  const [stock, setStock] = useState("")
  const [reorderLevel, setReorderLevel] = useState("")
  const [supplierName, setSupplierName] = useState("")
  const [supplierContact, setSupplierContact] = useState("")
  const [location, setLocation] = useState("")
  const [desc, setDesc] = useState("")
  const [tags, setTags] = useState("")
  const [status, setStatus] = useState("In Stock")
  const [images, setImages] = useState([])

  // ---------------- Fetch existing product if editing ----------------
  useEffect(() => {
    if (id) {
      getProduct(id).then((res) => {
        const p = res.data
        setSku(p.sku || "")
        setName(p.name || "")
        setCategory(p.category || "")
        setBrand(p.brand || "")
        setUnit(p.unit || "piece")
        setSize(p.size || "")
        setPrice(p.price || "")
        setDiscount(p.discount || "")
        setStock(p.stock || "")
        setReorderLevel(p.reorderLevel || "")
        setSupplierName(p.supplier?.name || "")
        setSupplierContact(p.supplier?.contact || "")
        setLocation(p.location || "")
        setDesc(p.description || "")
        setTags((p.tags || []).join(", "))
        setStatus(p.status || "In Stock")
        setImages(p.images || [])
      })
    }
  }, [id])

  // ---------------- Handle form submit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault()

    const product = {
      sku,
      name,
      category,
      brand,
      unit,
      size,
      price,
      discount,
      stock,
      reorderLevel,
      supplier: {
        name: supplierName,
        contact: supplierContact,
      },
      location,
      description: desc,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      status,
      images,
    }

    try {
      if (id) {
        await updateProduct(id, product)
      } else {
        await addProduct(product)
      }
      navigate("/admin/products")
    } catch (err) {
      console.error("Error saving product:", err)
      alert("Failed to save product.")
    }
  }

  // ---------------- Render ----------------
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content p-4">
        <h2 className="mb-3">{id ? "Edit Product" : "Add New Hardware Product"}</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          {/* SKU */}
          <input
            type="text"
            placeholder="SKU (e.g. HW-001)"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
          />

          {/* Name */}
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Cement">Cement</option>
            <option value="Steel">Steel</option>
            <option value="Paints">Paints</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Timber">Timber</option>
            <option value="Tools">Tools</option>
            <option value="Fasteners">Fasteners</option>
            <option value="Tiles">Tiles</option>
            <option value="Roofing">Roofing</option>
            <option value="Safety Gear">Safety Gear</option>
            <option value="Others">Others</option>
          </select>

          {/* Brand */}
          <input
            type="text"
            placeholder="Brand (e.g. Bamburi, Crown)"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />

          {/* Unit */}
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="piece">Piece</option>
            <option value="kg">Kilogram (kg)</option>
            <option value="litre">Litre</option>
            <option value="bag">Bag</option>
            <option value="set">Set</option>
            <option value="roll">Roll</option>
            <option value="meter">Meter</option>
            <option value="square_meter">Square Meter</option>
          </select>

          {/* Size */}
          <input
            type="text"
            placeholder="Size (e.g. 50kg, 2-inch pipe)"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />

          {/* Price */}
          <input
            type="number"
            placeholder="Price (Ksh)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          {/* Discount */}
          <input
            type="number"
            placeholder="Discount (%)"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />

          {/* Stock */}
          <input
            type="number"
            placeholder="Stock Quantity"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          {/* Reorder Level */}
          <input
            type="number"
            placeholder="Reorder Level"
            value={reorderLevel}
            onChange={(e) => setReorderLevel(e.target.value)}
          />

          {/* Supplier */}
          <input
            type="text"
            placeholder="Supplier Name"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Supplier Contact"
            value={supplierContact}
            onChange={(e) => setSupplierContact(e.target.value)}
          />

          {/* Location */}
          <input
            type="text"
            placeholder="Storage Location (e.g. Warehouse A)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          {/* Tags */}
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          {/* Status */}
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Discontinued">Discontinued</option>
          </select>

          {/* Description */}
          <textarea
            placeholder="Product Description"
            rows="4"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          {/* Images */}
          <input
            type="text"
            placeholder="Image URLs (comma separated)"
            value={images}
            onChange={(e) =>
              setImages(e.target.value.split(",").map((img) => img.trim()))
            }
          />

          <button type="submit" className="btn btn-success mt-3">
            {id ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  )
}