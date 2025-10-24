import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { CartProvider } from "./context/CartContext"

// ✅ Import Bootstrap & custom styles
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
)
