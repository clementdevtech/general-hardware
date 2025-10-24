export default function Services() {
  return (
    <div>
      {/* ✅ Header Banner */}
      <section
        className="text-white text-center py-5"
        style={{
          background: "linear-gradient(135deg, #6c757d, #adb5bd, #dee2e6)",
          color: "#212529",
          backgroundImage: "url('/images/hardware-bg.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <h1 className="display-4 fw-bold text-uppercase">Our Services</h1>
        <p className="lead fw-semibold">
          Reliable hardware and building solutions — from supplies to delivery and fabrication.
        </p>
      </section>

      {/* ✅ Services Cards */}
      <section className="container py-5">
        <div className="row g-4">
          {/* Delivery Services */}
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <img
                src="/images/delivery-truck.jpeg"
                className="card-img-top"
                alt="Delivery Services"
              />
              <div className="card-body">
                <h5 className="card-title fw-bold text-primary">
                  Fast & Reliable Delivery
                </h5>
                <p className="text-muted">
                  We deliver hardware and building materials directly to your site in Machakos,
                  Nairobi, and beyond — safely and on time.
                </p>
              </div>
            </div>
          </div>

          {/* Cutting & Fabrication */}
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <img
                src="/images/steel-cutting.jpeg"
                className="card-img-top"
                alt="Cutting & Fabrication"
              />
              <div className="card-body">
                <h5 className="card-title fw-bold text-primary">
                  Steel Cutting & Fabrication
                </h5>
                <p className="text-muted">
                  Need custom sizes? We offer accurate cutting, bending, and welding of steel bars,
                  wire mesh, and iron sheets for your project.
                </p>
              </div>
            </div>
          </div>

          {/* Bulk Orders & Wholesale */}
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <img
                src="/images/bulk-materials.jpeg"
                className="card-img-top"
                alt="Bulk Orders"
              />
              <div className="card-body">
                <h5 className="card-title fw-bold text-primary">
                  Bulk Orders & Wholesale
                </h5>
                <p className="text-muted">
                  Save more by ordering in bulk — we supply contractors, hardware shops, and
                  construction companies with discounted rates.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Support */}
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <img
                src="/images/technical-support.jpeg"
                className="card-img-top"
                alt="Technical Support"
              />
              <div className="card-body">
                <h5 className="card-title fw-bold text-primary">
                  Expert Technical Support
                </h5>
                <p className="text-muted">
                  Our experienced staff guide you on material selection, quality checks, and
                  best practices for your construction or renovation work.
                </p>
              </div>
            </div>
          </div>

          {/* Custom Orders */}
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <img
                src="/images/custom-orders.jpeg"
                className="card-img-top"
                alt="Custom Orders"
              />
              <div className="card-body">
                <h5 className="card-title fw-bold text-primary">
                  Custom Material Sourcing
                </h5>
                <p className="text-muted">
                  Can’t find a specific material? We’ll source it for you through our trusted
                  supplier network — locally or internationally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ CTA */}
      <section
        className="text-center py-5 text-light"
        style={{
          background: "linear-gradient(90deg, #495057, #6c757d, #adb5bd)",
          backgroundImage: "url('/images/metal-bg.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "multiply",
        }}
      >
        <h2 className="fw-bold text-warning">Building or Renovating?</h2>
        <p className="lead mb-4">
          Get all your building materials and tools from one trusted source — General Hardware,
          Athi River, Machakos.
        </p>
        <a href="/contact" className="btn btn-warning text-dark btn-lg fw-bold shadow">
          Contact Us Today
        </a>
      </section>
    </div>
  );
}
