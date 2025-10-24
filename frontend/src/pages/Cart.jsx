import { useState, useEffect } from "react"
import { useCart } from "../context/CartContext"
import products from "../data/products"
import { Link } from "react-router-dom"
import { FaWhatsapp, FaTools, FaTrashAlt, FaMapMarkerAlt } from "react-icons/fa"

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart } = useCart()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [loadingLocation, setLoadingLocation] = useState(false)

  const itemsWithData = cart.map((item) => {
    const product = products.find((p) => p.id === item.id)
    return {
      ...item,
      image: product?.image || "",
      price: product?.price || item.price,
    }
  })

  const total = itemsWithData.reduce((sum, item) => sum + item.price * item.qty, 0)

  // ✅ Automatically get user location
  useEffect(() => {
    const fetchLocation = () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.")
        return
      }

      setLoadingLocation(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`
          setLocation(mapLink)
          setLoadingLocation(false)
        },
        (error) => {
          console.error("Location error:", error)
          alert("Unable to retrieve your location. Please allow location access.")
          setLoadingLocation(false)
        }
      )
    }

    fetchLocation()
  }, [])

  const handleCheckout = () => {
    if (!name.trim() || !phone.trim()) {
      alert("Please enter your name and phone number before placing your order.")
      return
    }

    const orderLines = itemsWithData
      .map((item) => `${item.name} x${item.qty} - KSh ${item.price * item.qty}`)
      .join("\n")

    const message = `🧰 Hello, this is ${name}.\n📞 Phone: ${phone}\n\n🛒 I'd like to order:\n${orderLines}\n\n💰 Total: KSh ${total}\n📍 My Location: ${location || "Not shared"}\n\nFrom: General Hardware 🧱`

    const encoded = encodeURIComponent(message)
    const sellerPhone = "254787848787"
    window.open(`https://wa.me/${sellerPhone}?text=${encoded}`, "_blank")

    clearCart()
  }

  return (
    <div className="container py-5">
      {/* ✅ Header */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-uppercase text-dark">
          <FaTools className="me-2 text-warning" />
          General Hardware Cart
        </h2>
        <p className="text-muted">
          Review your selected tools, building materials, and equipment before checkout.
        </p>
        <div
          className="mx-auto mb-3"
          style={{
            width: "80px",
            height: "4px",
            background: "linear-gradient(90deg, #ffc107, #6c757d)",
          }}
        ></div>
      </div>

      {itemsWithData.length === 0 ? (
        <div className="text-center py-5">
          <img
            src="https://cdn-icons-png.flaticon.com/512/102/102661.png"
            alt="Empty Toolbox"
            style={{ width: "100px", marginBottom: "20px" }}
          />
          <h5 className="text-muted">Your toolbox is empty</h5>
          <Link to="/products" className="btn btn-warning mt-3 text-dark fw-semibold">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* ✅ Left: Cart Table */}
          <div className="col-lg-8">
            <div className="table-responsive shadow border border-2 border-secondary rounded">
              <table className="table align-middle mb-0">
                <thead className="bg-dark text-white">
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col" style={{ width: "120px" }}>
                      Qty
                    </th>
                    <th scope="col">Price</th>
                    <th scope="col">Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {itemsWithData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="me-3 rounded border"
                            style={{
                              width: "70px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                          <span className="fw-semibold">{item.name}</span>
                        </div>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          className="form-control form-control-sm text-center"
                          style={{ width: "70px" }}
                          onChange={(e) =>
                            updateQty(item.id, parseInt(e.target.value, 10))
                          }
                        />
                      </td>
                      <td className="fw-semibold text-warning">KSh {item.price}</td>
                      <td className="fw-semibold">KSh {item.price * item.qty}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <FaTrashAlt /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ✅ Right: Summary & Checkout */}
          <div className="col-lg-4">
            <div
              className="card shadow border-2 border-secondary"
              style={{ top: "80px", position: "sticky" }}
            >
              <div className="card-body">
                <h5 className="fw-bold text-dark mb-3">Customer Details</h5>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 7xx xxx xxx"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <FaMapMarkerAlt className="me-2 text-danger" />
                    Current Location
                  </label>
                  {loadingLocation ? (
                    <p className="text-muted">Detecting location...</p>
                  ) : location ? (
                    <a
                      href={location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-block text-decoration-none text-success"
                    >
                      View My Location on Google Maps
                    </a>
                  ) : (
                    <p className="text-danger">Location not detected</p>
                  )}
                </div>

                <hr className="text-secondary" />

                <div className="d-flex justify-content-between mb-3">
                  <span className="fw-semibold">Total</span>
                  <span className="fw-bold text-success">KSh {total}</span>
                </div>

                <button
                  className="btn btn-warning text-dark fw-semibold w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
                  onClick={handleCheckout}
                >
                  <FaWhatsapp /> Send Order via WhatsApp
                </button>

                <Link
                  to="/products"
                  className="btn btn-outline-secondary w-100 fw-semibold"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .table th, .table td {
          vertical-align: middle !important;
        }
        .table-hover tbody tr:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  )
}