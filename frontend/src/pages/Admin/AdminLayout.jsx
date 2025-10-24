import React, { useState } from "react"
import { Link, Outlet } from "react-router-dom"
import { FaBlog, FaBox, FaCogs } from "react-icons/fa"

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className={`bg-dark text-white p-3 ${
          collapsed ? "sidebar-collapsed" : "sidebar-expanded"
        } d-none d-md-block`} // ✅ hidden on small devices
        style={{ width: collapsed ? "70px" : "220px", transition: "width 0.3s" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          {!collapsed && <h5>Admin</h5>}
          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="blogs" className="nav-link text-white">
              <FaBlog /> {!collapsed && " Manage Blogs"}
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="products" className="nav-link text-white">
              <FaBox /> {!collapsed && " Manage Products"}
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="services" className="nav-link text-white">
              <FaCogs /> {!collapsed && " Manage Services"}
            </Link>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 p-3 bg-light">
        <Outlet />
      </div>
    </div>
  )
}
