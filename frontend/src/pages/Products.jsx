import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Slider from "rc-slider";
import Tooltip from "rc-tooltip";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";

import fetchProducts from "../data/products"; // backend API
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";

const toNumber = (v) => {
  if (v == null) return Infinity;
  const cleaned = String(v).replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : Infinity;
};

const CATEGORY_CHIPS = [
  "Cement & Concrete",
  "Steel & Reinforcement",
  "Roofing Materials",
  "Timber & Boards",
  "Plumbing Supplies",
  "Electrical Supplies",
  "Tiles & Finishes",
  "Paints & Chemicals",
  "Fasteners",
  "Fencing Materials",
  "Hand & Power Tools",
  "Doors & Windows",
  "Safety Equipment",
];

const HandleWithTooltip = ({ value = 0, dragging, index, ...rest }) => (
  <Tooltip
    prefixCls="rc-tooltip"
    overlay={`KES ${Number(value).toLocaleString()}`}
    visible={dragging}
    placement="top"
  >
    <div {...rest} />
  </Tooltip>
);

export default function Products() {
  const MAX_LIMIT = 500_000;
  const STEP = 1000;

  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [location, setLocation] = useState("All");
  const [maxPrice, setMaxPrice] = useState(MAX_LIMIT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data || []))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category || "Misc"));
    return ["All", ...unique];
  }, [products]);

  const brands = useMemo(() => {
    const unique = new Set(products.map((p) => p.brand || "Generic"));
    return ["All", ...unique];
  }, [products]);

  const locations = useMemo(() => {
    const unique = new Set(products.map((p) => p.location));
    return ["All", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const max = Number(maxPrice);
    return products.filter((p) => {
      const inCategory = category === "All" || p.category === category;
      const inBrand = brand === "All" || p.brand === brand;
      const inLocation = location === "All" || p.location === location;
      const priceNum = toNumber(p.price);
      return inCategory && inBrand && inLocation && priceNum <= max;
    });
  }, [products, category, brand, location, maxPrice]);

  if (loading)
    return <p className="text-center py-5">Loading hardware items...</p>;

  return (
    <div className="container py-5">
      <section className="text-center mb-5">
        <p className="section-label">Product Catalog</p>
        <h1 className="fw-bold mb-3">Your Complete Hardware Supply</h1>
        <p className="text-muted mx-auto" style={{ maxWidth: 760 }}>
          Browse our inventory of building materials, tools, roofing, plumbing,
          electrical supplies and more. Filter by category, brand, location or
          price to find the right products fast.
        </p>
      </section>

      <section className="mb-4">
        <div className="d-flex flex-column flex-sm-row flex-wrap gap-2 align-items-start align-items-sm-center justify-content-between">
          <div>
            <h2 className="h4 fw-bold text-dark mb-2">Shop by Category</h2>
            <p className="text-muted mb-0">
              Discover our 13 core supply lines and filter your search faster.
            </p>
          </div>
          <div className="text-muted small">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mt-3">
          {CATEGORY_CHIPS.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${category === cat ? "btn-success text-white" : "btn-outline-secondary"}`}
              type="button"
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Filters */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <label className="form-label fw-bold">Category</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label fw-bold">Brand</label>
          <select
            className="form-select"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            {brands.map((b, i) => (
              <option key={i} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label fw-bold">Location</label>
          <select
            className="form-select"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {locations.map((loc, i) => (
              <option key={i} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label fw-bold d-flex justify-content-between">
            <span>Max Price</span>
            <small className="text-success fw-semibold">
              {maxPrice >= MAX_LIMIT ? "Any" : `KES ${maxPrice.toLocaleString()}`}
            </small>
          </label>
          <Slider
            min={0}
            max={MAX_LIMIT}
            step={STEP}
            value={maxPrice}
            handleRender={(nodeProps) => <HandleWithTooltip {...nodeProps} />}
            onChange={(val) => setMaxPrice(val)}
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="row g-4">
        {filteredProducts.length === 0 ? (
          <div className="col-12 text-center text-muted py-5">
            No products found.
          </div>
        ) : (
          filteredProducts.map((p, i) => {
            const dirs = [
              { x: -80, opacity: 0 },
              { x: 80, opacity: 0 },
              { y: 80, opacity: 0 },
              { y: -80, opacity: 0 },
            ];
            return (
              <motion.div
                key={p._id || i}
                className="col-sm-6 col-md-4 col-lg-3"
                initial={dirs[i % dirs.length]}
                whileInView={{ x: 0, y: 0, opacity: 1 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.05,
                  type: "spring",
                  stiffness: 60,
                }}
                viewport={{ once: true }}
              >
                <ProductCard product={p} onQuickView={setSelected} />
              </motion.div>
            );
          })
        )}
      </div>

      {/* Product Modal */}
      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </div>
  );
}