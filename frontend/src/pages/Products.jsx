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
      .then((data) => setProducts(data))
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
      <div className="text-center mb-5">
        <h1 className="fw-bold text-success mb-2">🧱 Hardware Inventory</h1>
        <p className="text-muted">
          Browse through our tools, building materials, and accessories.
        </p>
      </div>

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