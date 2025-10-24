import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import WhatsAppButton from "../components/WhatsAppButton";
import { FaFacebook, FaTiktok, FaTimes } from "react-icons/fa";

// -----------------------------
// Constants
// -----------------------------
const STORAGE_KEY = "ghw:reviews:v1";

const MARQUEE_ITEMS = [
  "🧱 Building Materials",
  "🔩 Power Tools",
  "🎨 Paint & Finishes",
  "🚪 Doors & Windows",
  "🪚 Timber & Steel",
  "🧰 Plumbing & Electrical Supplies",
];

const FEATURES = [
  {
    icon: "🧱",
    title: "Top Quality Products",
    text: "We supply durable, trusted, and certified hardware materials.",
  },
  {
    icon: "💰",
    title: "Affordable Prices",
    text: "We offer fair and flexible prices to fit every project budget.",
  },
  {
    icon: "🧠",
    title: "Expert Guidance",
    text: "Our team helps you choose the right materials and tools.",
  },
  {
    icon: "🚚",
    title: "Fast Delivery",
    text: "Reliable delivery across Kenya — right to your site.",
  },
  {
    icon: "🛠️",
    title: "Wide Selection",
    text: "From cement to electricals, find everything under one roof.",
  },
];

const PRODUCTS = [
  {
    img: "/images/image25.jpeg",
    title: "Water Storage Tanks",
    text: "High-quality, durable tanks for domestic and commercial water storage.",
  },
  {
    img: "/images/image17.jpeg",
    title: "Steel Reinforcement Bars",
    text: "Strong and reliable steel bars — ideal for all your concrete structures.",
  },
  {
    img: "/images/image3.jpeg",
    title: "Iron Sheets & Wire Mesh",
    text: "Premium iron sheets and mesh rolls — perfect for roofing and reinforcement.",
  },
  {
    img: "/images/image16.jpeg",
    title: "Cement & Building Materials",
    text: "Strong, reliable, and ready for your next project.",
  },
];

// -----------------------------
// Motion Variants
// -----------------------------
const fadeRise = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const fade = { hidden: { opacity: 0 }, show: { opacity: 1 } };
const cardIn = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

// -----------------------------
// Utility Functions
// -----------------------------
function safeLoadReviews() {
  try {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function safeSaveReviews(reviews) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    // ignore
  }
}

// -----------------------------
// Star Rating
// -----------------------------
function StarRating({ value, onChange, idPrefix = "rating" }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div role="radiogroup" aria-label="Rating">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          onClick={() => onChange?.(star)}
          className="btn p-0 border-0 bg-transparent"
          style={{
            cursor: onChange ? "pointer" : "default",
            color: star <= value ? "#FBBF24" : "#E5E7EB",
            fontSize: "1.3rem",
            marginRight: 2,
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function StaticStars({ count }) {
  return (
    <div aria-label={`Rating ${count} out of 5`}>
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          style={{
            color: i < count ? "#FBBF24" : "#E5E7EB",
            fontSize: "1.1rem",
            marginRight: 2,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// -----------------------------
// Marquee
// -----------------------------
function Marquee({ items }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="bg-primary text-warning fw-semibold py-2 mt-5">
        <div className="container d-flex flex-wrap justify-content-center gap-3">
          {items.map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="mt-5 py-2 text-warning fw-semibold"
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        position: "absolute",
        bottom: 0,
        width: "100%",
        background: "#1E3A8A",
      }}
    >
      <div
        style={{
          display: "inline-block",
          animation: "scroll 22s linear infinite",
        }}
      >
        {items.concat(items).map((item, i) => (
          <span key={i} style={{ margin: "0 2rem" }}>
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          from { transform: translateX(0%); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// -----------------------------
// Main Component
// -----------------------------
export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const [reviews, setReviews] = useState(() => safeLoadReviews());
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [showSocials, setShowSocials] = useState(true);

  useEffect(() => safeSaveReviews(reviews), [reviews]);

  const canSubmit = useMemo(
    () => name.trim().length > 1 && message.trim().length > 5 && rating > 0,
    [name, message, rating]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setReviews([{ name: name.trim(), message: message.trim(), rating }, ...reviews]);
    setName("");
    setMessage("");
    setRating(0);
  };

  return (
    <main>
      {/* HERO */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={fade}
        transition={{ duration: 0.6 }}
        className="text-white text-center position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1E3A8A, #4B5563)",
          padding: "clamp(2.5rem, 4vw + 1rem, 5rem) 0",
        }}
      >
        <div className="container position-relative">
          <motion.h1 variants={fadeRise} className="fw-bold mb-3 display-5">
            Welcome to General Hardware
          </motion.h1>
          <motion.p
            variants={fadeRise}
            className="text-light mx-auto mb-4 lead"
            style={{ maxWidth: 780 }}
          >
            Supplying Kenya with top-quality building materials, tools, and hardware essentials.
          </motion.p>
          <motion.div
            animate={prefersReducedMotion ? {} : { y: [0, -10, 0] }}
            transition={prefersReducedMotion ? {} : { repeat: Infinity, duration: 2 }}
          >
            <Link to="/products" className="btn btn-warning fw-bold px-4 py-3 rounded-pill shadow">
              🛒 Shop Now
            </Link>
          </motion.div>
        </div>
        <Marquee items={MARQUEE_ITEMS} />
      </motion.section>

      {/* WHY CHOOSE US */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={fade}
        className="bg-light py-5"
      >
        <div className="container text-center">
          <h2 className="fw-bold mb-4 text-primary">Why Choose General Hardware?</h2>
          <div className="row g-4 justify-content-center">
            {FEATURES.map((item, idx) => (
              <motion.div key={idx} className="col-12 col-sm-6 col-lg-4" custom={idx} variants={cardIn}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div style={{ fontSize: "1.75rem" }}>{item.icon}</div>
                    <h3 className="h5 fw-bold text-primary mt-2">{item.title}</h3>
                    <p className="text-muted">{item.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FEATURED PRODUCTS */}
      <motion.section
        initial="hidden"
        whileInView="show"
        variants={fade}
        className="container py-5"
      >
        <h2 className="fw-bold mb-4 text-center text-primary">Featured Products</h2>
        <div className="row g-4">
          {PRODUCTS.map((item, idx) => (
            <motion.div key={idx} className="col-12 col-md-6 col-lg-4" custom={idx} variants={cardIn}>
              <article className="card shadow-sm h-100 border-0">
                <img
                  src={item.img}
                  alt={item.title}
                  className="card-img-top"
                  style={{ height: 220, objectFit: "cover" }}
                />
                <div className="card-body">
                  <h3 className="h5 fw-bold text-primary">{item.title}</h3>
                  <p className="text-muted">{item.text}</p>
                </div>
              </article>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link to="/products" className="btn btn-outline-primary btn-lg">
            View All Tools
          </Link>
        </div>
      </motion.section>

      {/* CUSTOMER REVIEWS */}
      <motion.section className="bg-light py-5" variants={fade}>
        <div className="container">
          <h2 className="fw-bold mb-4 text-center text-primary">Customer Reviews</h2>
          <div className="row g-4 mb-4">
            {reviews.length === 0 ? (
              <p className="text-center text-muted">No reviews yet. Be the first!</p>
            ) : (
              reviews.map((r, i) => (
                <motion.div key={i} className="col-12 col-md-6 col-lg-4" custom={i} variants={cardIn}>
                  <div className="p-4 border rounded shadow-sm bg-white h-100">
                    <div className="mb-2">
                      <StaticStars count={r.rating} />
                    </div>
                    <p className="flex-grow-1">“{r.message}”</p>
                    <h6 className="fw-bold text-primary mb-0">— {r.name}</h6>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <motion.div className="card shadow-sm">
            <div className="card-body">
              <h3 className="h5 fw-bold mb-3 text-primary">Leave a Review</h3>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">Your Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Jane Doe"
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label">Your Rating</label>
                    <StarRating value={rating} onChange={setRating} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Your Review</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your experience..."
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary mt-3" disabled={!canSubmit}>
                  Submit Review
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* MINI CONTACT */}
      <section className="bg-dark text-light text-center py-5">
        <div className="container">
          <h3 className="fw-bold mb-3 text-warning">
            Find Us in Athi River, Machakos
          </h3>
          <p className="mb-3">
            Visit our store or reach us via WhatsApp at{" "}
            <strong>+254 787 848 787</strong>.
          </p>
          <Link to="/contact" className="btn btn-warning text-dark fw-bold mt-2">
            Contact Us
          </Link>
        </div>
      </section>

      {/* CTA */}
      <motion.section
        className="text-center text-white py-5"
        style={{ background: "linear-gradient(90deg, #1E40AF, #4B5563)" }}
      >
        <div className="container">
          <h2 className="fw-bold">Building Something Great?</h2>
          <p className="lead mb-3">
            We’ve got everything you need — from foundation to finishing.
          </p>
          <Link to="/products" className="btn btn-warning text-dark fw-bold btn-lg">
            Start Shopping
          </Link>
        </div>
      </motion.section>

      {/* FLOATING SOCIALS (modernized) */}
      <motion.nav
        aria-label="Quick social actions"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 12,
          zIndex: 2000,
        }}
      >
        {showSocials ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <WhatsAppButton
                phone="254787848787"
                message="Hello General Hardware! I’d like to inquire about your products."
              />
              <a
                href="https://www.facebook.com/profile.php?id=61582716723627"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-circle d-flex align-items-center justify-content-center shadow"
                style={{
                  width: 52,
                  height: 52,
                  background: "#1877F2",
                  color: "#fff",
                  transition: "all 0.3s ease",
                }}
              >
                <FaFacebook size={22} />
              </a>
              <a
                href="https://www.tiktok.com/@buildingstell2?_t=ZS-90kxeB419po&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-circle d-flex align-items-center justify-content-center shadow"
                style={{
                  width: 52,
                  height: 52,
                  background: "#000",
                  color: "#fff",
                  transition: "all 0.3s ease",
                }}
              >
                <FaTiktok size={22} />
              </a>
            </motion.div>

            <motion.button
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSocials(false)}
              className="rounded-circle shadow-sm d-flex align-items-center justify-content-center"
              style={{
                width: 52,
                height: 52,
                background: "#374151",
                border: "none",
                color: "#fff",
              }}
            >
              <FaTimes size={20} />
            </motion.button>
          </>
        ) : (
          <motion.button
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSocials(true)}
            className="rounded-circle shadow d-flex align-items-center justify-content-center"
            style={{
              width: 56,
              height: 56,
              background: "#10B981",
              color: "#fff",
              border: "none",
            }}
          >
            💬
          </motion.button>
        )}
      </motion.nav>
    </main>
  );
}
