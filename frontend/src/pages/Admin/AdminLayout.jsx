import React, { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaBlog, FaBox, FaCogs } from "react-icons/fa";
import "../../assets/styles/admin.css";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-redirect to products when visiting /admin
  useEffect(() => {
    if (location.pathname === "/admin" || location.pathname === "/admin/") {
      navigate("products");
    }
  }, [location, navigate]);

  return (
    <div className="d-flex flex-column flex-md-row" style={{ minHeight: "100vh" }}>
      {/* Sidebar on desktop / Top nav on mobile */}
      <nav
        className="admin-nav bg-dark text-white d-flex flex-md-column align-items-center align-items-md-start gap-3"
      >
        {/* Brand / Title */}
        <div className="d-flex align-items-center justify-content-between w-100 px-3 py-2 border-bottom border-secondary">
          <h5 className="mb-0 d-none d-md-block">Admin</h5>
          <h6 className="mb-0 d-md-none text-warning">Admin Menu</h6>
        </div>

        {/* Nav Links */}
        <ul className="nav flex-row flex-md-column justify-content-center justify-content-md-start w-100 px-2 px-md-3 py-1 py-md-3 m-0">
          <li className="nav-item me-2 me-md-0 mb-md-2">
            <Link
              to="blogs"
              className={`nav-link text-white ${
                location.pathname.includes("blogs") ? "fw-bold text-warning" : ""
              }`}
            >
              <FaBlog className="me-1" />
              <span className="d-none d-sm-inline">Manage </span>Blogs
            </Link>
          </li>

          <li className="nav-item me-2 me-md-0 mb-md-2">
            <Link
              to="products"
              className={`nav-link text-white ${
                location.pathname.includes("products") ? "fw-bold text-warning" : ""
              }`}
            >
              <FaBox className="me-1" />
              <span className="d-none d-sm-inline">Manage </span>Products
            </Link>
          </li>

          <li className="nav-item me-2 me-md-0 mb-md-2">
            <Link
              to="services"
              className={`nav-link text-white ${
                location.pathname.includes("services") ? "fw-bold text-warning" : ""
              }`}
            >
              <FaCogs className="me-1" />
              <span className="d-none d-sm-inline">Manage </span>Services
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-grow-1 bg-light">
        <div className="bg-dark text-white d-flex align-items-center justify-content-between px-3 py-2 shadow-sm">
          <h5 className="m-0">Admin Dashboard</h5>
          <span className="small text-secondary">Welcome, Admin</span>
        </div>

        <div className="p-3">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
