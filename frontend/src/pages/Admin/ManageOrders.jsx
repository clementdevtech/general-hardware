import { useEffect, useState } from "react"
import API from "../../api"
import "../../assets/styles/ManageProducts.css"

const STATUS_OPTIONS = ["pending", "processing", "dispatched", "completed", "cancelled"]

export default function ManageOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await API.get("/orders")
      setOrders(res.data)
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateStatus = async (orderId, status) => {
    try {
      const res = await API.put(`/orders/${orderId}/status`, { status })
      setOrders((prev) => prev.map((order) => (order._id === orderId ? res.data : order)))
    } catch (err) {
      console.error("Failed to update order status:", err)
      alert("Unable to update order status")
    }
  }

  if (loading) return <p>Loading orders...</p>
  if (error) return <p className="text-danger">{error}</p>

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2>📦 Manage Orders</h2>
      </div>

      {orders.length === 0 ? (
        <p className="text-muted">No orders yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Total</th>
                <th>Status</th>
                <th>Created</th>
                <th>Emails</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.name}</td>
                  <td>{order.phone}</td>
                  <td>KES {order.total?.toLocaleString()}</td>
                  <td>
                    <span className={`badge bg-${
                      order.status === "pending"
                        ? "warning"
                        : order.status === "processing"
                        ? "info"
                        : order.status === "dispatched"
                        ? "primary"
                        : order.status === "completed"
                        ? "success"
                        : "danger"
                    } text-dark`}>{order.status}</span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>{order.emails?.length || 0}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
