import { useEffect, useState, useRef } from "react";

export default function ProductViewer360({ images }) {
  const [index, setIndex] = useState(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    startAutoRotate();
    return stopAutoRotate;
  }, []);

  const startAutoRotate = () => {
    stopAutoRotate();
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 1200);
  };

  const stopAutoRotate = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleDown = (e) => {
    dragging.current = true;
    lastX.current = e.clientX || e.touches[0].clientX;
    stopAutoRotate();
  };

  const handleMove = (e) => {
    if (!dragging.current) return;
    const x = e.clientX || e.touches[0].clientX;
    const delta = x - lastX.current;
    if (Math.abs(delta) > 15) {
      setIndex((prev) =>
        delta > 0
          ? (prev - 1 + images.length) % images.length
          : (prev + 1) % images.length
      );
      lastX.current = x;
    }
  };

  const handleUp = () => {
    dragging.current = false;
    startAutoRotate();
  };

  return (
    <div
      className="user-select-none"
      style={{ cursor: "grab" }}
      onMouseDown={handleDown}
      onMouseMove={handleMove}
      onMouseUp={handleUp}
      onMouseLeave={handleUp}
      onTouchStart={handleDown}
      onTouchMove={handleMove}
      onTouchEnd={handleUp}
    >
      <img
        src={images[index]}
        alt="360° view"
        className="img-fluid rounded shadow-sm"
        style={{ maxHeight: "320px", objectFit: "cover", width: "100%" }}
      />
      <p className="text-muted small mt-2 text-center">
        Drag left/right or wait for auto-rotation
      </p>
    </div>
  );
}
