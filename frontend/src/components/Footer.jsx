import { FaFacebookF, FaTiktok, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-4 mt-auto">
      <div className="container">
        {/* ✅ Company Info */}
        <p className="mb-1">
          &copy; {new Date().getFullYear()} <strong>General Hardware </strong>. All Rights Reserved.
        </p>
        <p className="small mb-3">
          we’ve got everything you need to build, fix, and finish right.
        </p>

        {/* ✅ Social Media Links */}
        <div className="d-flex justify-content-center gap-3">
          <a
            href="https://www.tiktok.com/@buildingstell2?_t=ZS-90kxeB419po&_r=1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white fs-5"
          >
            <FaTiktok />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61582716723627"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white fs-5"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://wa.me/254787848787"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white fs-5"
          >
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </footer>
  );
}
