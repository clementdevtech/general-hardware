export default function Contact() {
  const handleWhatsAppSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const message = e.target.message.value.trim();

    // ✅ Optional backend email send
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
    } catch (err) {
      console.error("Backend error:", err);
    }

    // ✅ WhatsApp redirect
    const text = encodeURIComponent(
      `👋 Hello *General Hardware*,\n\n📛 Name: ${name}\n📧 Email: ${email}\n💬 Message: ${message}\n\n📍 From: Athi River, Machakos – Kenya`
    );
    const phoneNumber = "254780396517";
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank");
  };

  return (
    <div className="container py-5">
      {/* ✅ Page Title */}
      <div className="text-center mb-5">
        <h2 className="fw-bold text-success text-uppercase">
          Contact General Hardware
        </h2>
        <p className="text-muted">
          We supply all types of building materials, tools, and fittings in{" "}
          <strong>Athi River, Machakos – Kenya.</strong>
        </p>
        <div
          className="mx-auto mb-3"
          style={{
            width: "80px",
            height: "4px",
            background: "linear-gradient(90deg, #28a745, #6c757d)",
          }}
        ></div>
      </div>

      <div className="row g-4">
        {/* ✅ Contact Information */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold text-success mb-3">Get in Touch</h5>
              <p><strong>📞 Phone:</strong> +254 780 396 517</p>
              <p><strong>✉️ Email:</strong> sales@generalhardware.co.ke</p>
              <p><strong>📍 Location:</strong> Athi River, Machakos – Kenya</p>
              <p><strong>🕒 Working Hours:</strong> Mon–Sat: 8:00 AM – 6:00 PM</p>

              {/* ✅ Google Maps Embed */}
              <div className="mt-4">
                <iframe
                  title="General Hardware Location"
                  src="https://www.google.com/maps?q=Athi+River,+Machakos,+Kenya&output=embed"
                  width="100%"
                  height="250"
                  style={{ border: 0, borderRadius: "10px" }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Contact Form */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold text-success mb-3">Send Us a Message</h5>
              <form onSubmit={handleWhatsAppSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Message</label>
                  <textarea
                    name="message"
                    className="form-control"
                    rows="4"
                    placeholder="Write your message here..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn btn-success w-100 fw-semibold"
                >
                  💬 Send via WhatsApp & Email
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Styling */}
      <style>{`
        .form-control:focus {
          border-color: #28a745;
          box-shadow: 0 0 0 0.2rem rgba(40,167,69,0.25);
        }
      `}</style>
    </div>
  );
}
