import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import fetchProducts from "../data/products";

export default function Gallery() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    fetchProducts()
      .then((data) => data && setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  const openGallery = (product) => {
    setSelected(product);
    setImgIndex(0);
  };

  const nextImage = () => {
    if (!selected) return;
    const imgs = selected.images?.length ? selected.images : [selected.image];
    setImgIndex((prev) => (prev + 1) % imgs.length);
  };

  const prevImage = () => {
    if (!selected) return;
    const imgs = selected.images?.length ? selected.images : [selected.image];
    setImgIndex((prev) => (prev - 1 + imgs.length) % imgs.length);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (!selected) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected]);

  if (loading) return <p className="text-center py-5">Loading gallery...</p>;

  return (
    <div>
      {/* Banner */}
      <section className="bg-dark text-light text-center py-5">
        <h1 className="display-5 fw-bold text-warning">🔧 Hardware Gallery</h1>
        <p className="lead">
          Explore our latest tools, materials, and building accessories.
        </p>
      </section>

      {/* Grid */}
      <section className="container py-5">
        <div className="row g-4">
          {products.map((p) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={p._id}>
              <div
                className="card border-0 shadow-sm h-100"
                onClick={() => openGallery(p)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={p.image || "/placeholder.jpg"}
                  alt={p.name}
                  className="card-img-top"
                  style={{
                    height: "220px",
                    objectFit: "cover",
                    borderTopLeftRadius: "0.5rem",
                    borderTopRightRadius: "0.5rem",
                  }}
                />
                <div className="card-body text-center">
                  <p className="fw-semibold mb-0">{p.name}</p>
                  <small className="text-muted">
                    {p.category || "Hardware"} • {p.location || "Main Store"}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <Modal
        show={!!selected}
        onHide={() => {
          setSelected(null);
          setImgIndex(0);
        }}
        centered
        size="lg"
      >
        {selected && (() => {
          const imgs = selected.images?.length ? selected.images : [selected.image];
          return (
            <>
              <Modal.Body className="p-0 text-center bg-dark">
                <img
                  src={imgs[imgIndex]}
                  alt={selected.name}
                  className="img-fluid w-100"
                  style={{
                    maxHeight: "70vh",
                    objectFit: "contain",
                  }}
                />
              </Modal.Body>
              <Modal.Footer className="d-flex justify-content-between bg-dark text-light">
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={prevImage}
                  disabled={imgs.length <= 1}
                >
                  ◀ Prev
                </button>
                <p className="mb-0 small">
                  {selected.name} • Image {imgIndex + 1}/{imgs.length}
                </p>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={nextImage}
                  disabled={imgs.length <= 1}
                >
                  Next ▶
                </button>
              </Modal.Footer>
            </>
          );
        })()}
      </Modal>
    </div>
  );
}
