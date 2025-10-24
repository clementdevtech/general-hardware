import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import API from "../../api"

export default function ManageProducts() {
  const [products, setProducts] = useState([])

  // Fetch all products
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

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return
    try {
      await API.delete(`/products/${id}`)
      setProducts(products.filter((p) => p._id !== id))
    } catch (err) {
      console.error("Error deleting product:", err)
    }
  }

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>🧰 Manage Hardware Products</h2>
        <Link to="/admin/products/new" className="btn btn-success">
          + Add New Product
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Unit</th>
              <th>Stock</th>
              <th>Price (Ksh)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p._id}>
                  <td>
                    {p.images && p.images.length > 0 ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    ) : (
                      <span className="text-muted">No Image</span>
                    )}
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                  </td>
                  <td>{p.category || "—"}</td>
                  <td>{p.brand || "—"}</td>
                  <td>{p.unit || "—"}</td>
                  <td>{p.stock || 0}</td>
                  <td>{p.price ? p.price.toLocaleString() : "—"}</td>
                  <td>
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
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted">
                  No products found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
