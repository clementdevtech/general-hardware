import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

const EmailVerification = () => {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [verificationCountdown, setVerificationCountdown] = useState(null);
  const [resendCountdown, setResendCountdown] = useState(null);
  const [canResend, setCanResend] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Restore countdowns from localStorage on page reload
  useEffect(() => {
    const savedVerificationExpiry = localStorage.getItem("verificationExpiry");
    const savedResendExpiry = localStorage.getItem("resendExpiry");

    if (savedVerificationExpiry) {
      const remaining = Math.floor((savedVerificationExpiry - Date.now()) / 1000);
      if (remaining > 0) setVerificationCountdown(remaining);
    }

    if (savedResendExpiry) {
      const remaining = Math.floor((savedResendExpiry - Date.now()) / 1000);
      if (remaining > 0) {
        setResendCountdown(remaining);
        setCanResend(false);
      } else {
        setCanResend(true);
      }
    }
  }, []);

  // ✅ Detect token/email in URL and auto-verify
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const emailFromLink = params.get("email");

    if (token && emailFromLink) {
      setEmail(decodeURIComponent(emailFromLink));
      setShowCodeInput(true);

      API.get(`/auth/verify-email?token=${token}&email=${emailFromLink}`)
        .then((res) => {
          alert(res.data.message);
          navigate("/login");
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Verification failed.");
        });
    }
  }, [location, navigate]);

  // ✅ Verification countdown (10 minutes)
  useEffect(() => {
    if (verificationCountdown > 0) {
      const timer = setTimeout(() => setVerificationCountdown((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [verificationCountdown]);

  // ✅ Resend countdown (1 minute)
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendCountdown === 0) {
      setCanResend(true);
    }
  }, [resendCountdown]);

  // ✅ Handle code input (6 digits only)
  const handleChange = (e) => {
    const input = e.target.value.replace(/\D/g, "");
    setCode(input.slice(0, 6));
  };

  // ✅ Handle manual verification
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Verification code must be 6 digits.");
      return;
    }

    try {
      const res = await API.post(`/auth/verify-email`, { code, email });
      alert(res.data.message);
      localStorage.removeItem("verificationExpiry");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.");
    }
  };

  // ✅ Send code + start countdowns (persistent)
  const handleSendCode = async () => {
    if (!email) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      await API.post(`/auth/sendcode`, { email });
      setError("");
      setShowCodeInput(true);

      // 10-minute verification expiry
      const verificationExpiry = Date.now() + 600000;
      const resendExpiry = Date.now() + 60000;

      localStorage.setItem("verificationExpiry", verificationExpiry);
      localStorage.setItem("resendExpiry", resendExpiry);

      setVerificationCountdown(600);
      setResendCountdown(60);
      setCanResend(false);

      alert("A verification code has been sent to your email.");
    } catch (err) {
      setError("Failed to send verification code. Please try again.");
    }
  };

  // 🧭 Center page with Bootstrap + flexbox
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "#f8f9fa" }}
    >
      <div
        className="card shadow-lg p-4 text-center"
        style={{ maxWidth: "400px", width: "100%", borderRadius: "15px" }}
      >
        <h2 className="mb-3">Email Verification</h2>
        {error && <p className="text-danger">{error}</p>}

        {/* Email Input */}
        {!showCodeInput && (
          <div>
            <label className="fw-semibold">Enter your email:</label>
            <input
              type="email"
              className="form-control mb-3 text-center"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button variant="primary" onClick={handleSendCode} className="w-100">
              Send Verification Email
            </Button>
          </div>
        )}

        {/* Code Input */}
        {showCodeInput && (
          <form onSubmit={handleSubmit} className="mt-3">
            <label className="fw-semibold">Enter Verification Code:</label>
            <input
              type="text"
              name="code"
              className="form-control mb-3 text-center"
              value={code}
              onChange={handleChange}
              required
            />
            <p className="small text-muted">
              {verificationCountdown > 0
                ? `Code expires in ${Math.floor(verificationCountdown / 60)}:${(
                    verificationCountdown % 60
                  )
                    .toString()
                    .padStart(2, "0")}`
                : "Code expired. Request a new one."}
            </p>
            <Button
              type="submit"
              variant="success"
              disabled={verificationCountdown <= 0}
              className="w-100"
            >
              Verify
            </Button>
          </form>
        )}

        {/* Resend Button */}
        {showCodeInput && (
          <div className="mt-3">
            <Button
              variant="secondary"
              onClick={handleSendCode}
              disabled={!canResend}
              className="w-100"
            >
              {canResend
                ? "Resend Code"
                : `Resend in ${Math.floor(resendCountdown / 60)}:${(
                    resendCountdown % 60
                  )
                    .toString()
                    .padStart(2, "0")}`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
