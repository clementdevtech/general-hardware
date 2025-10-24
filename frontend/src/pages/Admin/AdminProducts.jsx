import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../../api"

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [brand, setBrand] = useState("")
  const [unit, setUnit] = useState("")
  const [stock, setStock] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [images, setImages] = useState([])

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products")
      setProducts(res.data)
    } catch (err) {
      console.error("Error fetching products:", err)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Add new product
  const handleAdd = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("name", name)
    formData.append("category", category)
    formData.append("brand", brand)
    formData.append("unit", unit)
    formData.append("stock", stock)
    formData.append("price", price)
    formData.append("description", description)
    images.forEach((img) => formData.append("images", img))

    try {
      await API.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      await fetchProducts()
      setName("")
      setCategory("")
      setBrand("")
      setUnit("")
      setStock("")
      setPrice("")
      setDescription("")
      setImages([])
    } catch (err) {
      console.error("Error adding product:", err)
      alert("Error adding product.")
    }
  }

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return
    try {
      await API.delete(`/products/${id}`)
      setProducts(products.filter((p) => p._id !== id))
    } catch (err) {
      console.error("Error deleting product:", err)
    }
  }

  return (
    <div className="container py-3">
      <h2 className="mb-4">🧰 Manage Hardware Products</h2>

      {/* Add Product Form */}
      <form onSubmit={handleAdd} className="mb-5" encType="multipart/form-data">
        <div className="row g-2">
          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Category (e.g. Cement, Paint, Nails)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Brand (optional)"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Unit (e.g. bag, litre, pcs)"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
            />
          </div>

          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Stock Qty"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>

          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Price per Unit"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="col-md-12">
            <textarea
              className="form-control"
              rows="4"
              placeholder="Product Description / Specifications"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">Upload Images</label>
            <input
              type="file"
              className="form-control"
              multiple
              onChange={(e) => setImages(Array.from(e.target.files))}
            />
          </div>

          <div className="col-md-12">
            <button type="submit" className="btn btn-success mt-2">
              ➕ Add Product
            </button>
          </div>
        </div>
      </form>

      {/* Product List */}
      <h4 className="mb-3">📦 Inventory</h4>
      <ul className="list-group">
        {products.map((p) => (
          <li key={p._id} className="list-group-item mb-2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{p.name}</strong> <span className="text-muted">({p.category})</span>
                <br />
                <small>
                  Brand: {p.brand || "N/A"} | {p.unit} | Stock: {p.stock} | Ksh {p.price}
                </small>
              </div>
              <div>
                <Link
                  to={`/admin/products/edit/${p._id}`}
                  className="btn btn-sm btn-warning me-2"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              </div>
            </div>

            {p.description && (
              <p className="mt-2 text-muted">
                {p.description.substring(0, 150)}...
              </p>
            )}

            {p.images && p.images.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mt-2">
                {p.images.map((img, idx) => (
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
          </li>
        ))}
      </ul>
    </div>
  )
}