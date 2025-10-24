import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { cart } = useCart();
  const { user, logout, loading } = useAuth();
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderAuthLinks = () => {
    if (loading) return <li className="nav-item">Loading...</li>;

    if (!user) {
      return (
        <li className="nav-item">
          <Link className="nav-link" to="/login" onClick={() => setIsOpen(false)}>
            Login
          </Link>
        </li>
      );
    }

    return (
      <>
        {user.role === "admin" && (
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/admin"
              onClick={() => setIsOpen(false)}
            >
              Admin Dashboard
            </Link>
          </li>
        )}
        <li className="nav-item">
          <button
            className="btn btn-outline-light w-100 text-start"
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
          >
            Logout ({user.username})
          </button>
        </li>
      </>
    );
  };

  return (
    <>
      {/* Fixed Navbar */}
      <nav
        className={`navbar navbar-expand-lg fixed-top ${
          scrolled ? "navbar-scrolled" : "navbar-top"
        }`}
      >
        <div className="container d-flex justify-content-between align-items-center">
          <Link className="navbar-brand fw-bold text-uppercase" to="/">
            General Hardware
          </Link>

          <button
            className="btn btn-outline-light d-lg-none"
            onClick={() => setIsOpen(true)}
          >
            ☰
          </button>

          <ul className="navbar-nav ms-auto d-none d-lg-flex flex-row gap-3 align-items-center">
            <li><Link className="nav-link" to="/">Home</Link></li>
            <li><Link className="nav-link" to="/products">Products</Link></li>
            <li><Link className="nav-link" to="/services">Services</Link></li>
            <li><Link className="nav-link" to="/gallery">Gallery</Link></li>
            <li><Link className="nav-link" to="/blog">Blog</Link></li>
            <li><Link className="nav-link" to="/contact">Contact</Link></li>
            <li>
              <Link className="btn btn-success position-relative" to="/cart">
                Cart
                {itemCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.75rem" }}>
                    {itemCount}
                  </span>
                )}
              </Link>
            </li>
            {renderAuthLinks()}
          </ul>
        </div>
      </nav>

      {/* Mobile Offcanvas */}
      <div
        className={`offcanvas-menu ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(false)}
      >
        <div className="offcanvas-content" onClick={(e) => e.stopPropagation()}>
          <button className="btn-close btn-close-white ms-auto mb-4" onClick={() => setIsOpen(false)}></button>
          <ul className="navbar-nav gap-3">
            <li><Link className="nav-link" to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
            <li><Link className="nav-link" to="/products" onClick={() => setIsOpen(false)}>Products</Link></li>
            <li><Link className="nav-link" to="/services" onClick={() => setIsOpen(false)}>Services</Link></li>
            <li><Link className="nav-link" to="/gallery" onClick={() => setIsOpen(false)}>Gallery</Link></li>
            <li><Link className="nav-link" to="/blog" onClick={() => setIsOpen(false)}>Blog</Link></li>
            <li><Link className="nav-link" to="/contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
            <li>
              <Link className="btn btn-success position-relative w-100" to="/cart" onClick={() => setIsOpen(false)}>
                Cart
                {itemCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.75rem" }}>
                    {itemCount}
                  </span>
                )}
              </Link>
            </li>
            {renderAuthLinks()}
          </ul>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .navbar {
          transition: background-color 0.4s ease, box-shadow 0.4s ease;
          backdrop-filter: blur(10px);
        }
        .navbar-top {
          background: linear-gradient(145deg, #c0c0c0, #dcdcdc);
          color: #000;
          box-shadow: none;
        }
        .navbar-scrolled {
          background: linear-gradient(145deg, #a8a8a8, #8f8f8f);
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        .navbar-brand, .nav-link {
          color: #fff !important;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .nav-link:hover {
          color: #00ffcc !important;
        }

        /* Offcanvas Styles */
        .offcanvas-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          transform: translateX(-100%);
          transition: transform 0.3s ease-in-out;
          z-index: 1050;
        }
        .offcanvas-menu.open {
          transform: translateX(0);
        }
        .offcanvas-content {
          background: linear-gradient(145deg, #1e293b, #0f172a);
          width: 260px;
          height: 100%;
          padding: 25px;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.4);
          color: #fff;
          display: flex;
          flex-direction: column;
        }
        .offcanvas-content .nav-link {
          color: #f8fafc !important;
          font-size: 1.1rem;
          padding: 6px 0;
          transition: color 0.3s ease, transform 0.2s ease;
        }
        .offcanvas-content .nav-link:hover {
          color: #22d3ee !important;
          transform: translateX(5px);
        }
        @media (min-width: 992px) {
          .offcanvas-menu {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
