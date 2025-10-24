import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton({ phone = "254787848787", message = "Hello, I’m interested in your products!" }) {
  const handleClick = () => {
    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMsg}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#25D366",
        border: "none",
        borderRadius: "50%",
        width: "60px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
        cursor: "pointer",
        zIndex: 1000,
      }}
    >
      <FaWhatsapp size={30} color="white" />
    </button>
  );
}
