import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const [showMsg, setShowMsg] = useState(false);

  const handleReserve = () => {
    addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      qty: 1,
    });

    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 5000);
  };

  return (
    <div className="card h-100 shadow-sm position-relative">
      <img
        src={
          product.images?.[0]
            ? typeof product.images[0] === "string"
              ? product.images[0]
              : `data:${product.images[0].contentType};base64,${product.images[0].data}`
            : product.image
        }
        className="card-img-top"
        alt={product.name}
        style={{ height: "200px", objectFit: "cover" }}
      />

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>

        {product.size && <p className="text-muted">{product.size} sqm</p>}
        {product.price && (
          <p className="text-muted">
            KES {Number(product.price).toLocaleString()}
          </p>
        )}
        <p className="small text-secondary">{product.location}</p>

        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="fw-bold text-primary">
            {product.paymentPlan || "Flexible Payment Options"}
          </span>
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => onQuickView(product)}
            >
              Quick View
            </button>
            {product.price && (
              <button className="btn btn-sm btn-success" onClick={handleReserve}>
                Reserve
              </button>
            )}
          </div>
        </div>
      </div>

      {showMsg && (
        <div className="reserve-toast">
          ✅ {product.name} reserved! Check your cart.
        </div>
      )}

      <style>{`
        .reserve-toast {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(40, 167, 69, 0.95);
          color: #fff;
          padding: 8px 15px;
          border-radius: 6px;
          font-size: 0.9rem;
          animation: fadeInOut 5s forwards;
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, 20px); }
          10%,90% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -20px); }
        }
      `}</style>
    </div>
  );
}
