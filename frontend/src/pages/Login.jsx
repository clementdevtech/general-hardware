import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import API from "../api";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back to previous page or home
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("🔑 Submitting login with:", user);

      const res = await API.post("/auth/login", {
        email: user.email.trim(),
        password: user.password,
      });

      console.log("✅ Login success:", res.data);

      // Save token + user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert(res.data.message || "Login successful!");

      // Redirect after login
      navigate(from, { replace: true });
    } catch (err) {
      console.error("❌ Login failed:", err.response || err.message);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="d-flex align-items-center min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            <div className="card shadow p-4 bg-white rounded">
              <h3 className="text-center mb-4">Login</h3>

              {error && (
                <div className="alert alert-danger py-2" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    value={user.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Password
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control pe-5"
                      name="password"
                      id="password"
                      placeholder="Enter your password"
                      value={user.password}
                      onChange={handleChange}
                      required
                    />
                    <span
                      className="position-absolute top-50 end-0 translate-middle-y me-3"
                      style={{ cursor: "pointer", color: "#6c757d" }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>

              {/* Links */}
              <div className="text-center mt-3">
                <Link to="/forgot-password" className="text-decoration-none">
                  Forgot Password?
                </Link>
              </div>
              <div className="text-center mt-2">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="text-decoration-none">
                  Register here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;