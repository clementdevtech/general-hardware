import API from "../api";

const fallbackProducts = [
  {
    _id: "fallback-1",
    name: "Portland Cement 50kg",
    category: "Cement & Concrete",
    brand: "General Hardware",
    price: "2,100",
    location: "Athi River",
    paymentPlan: "Cash or Credit",
    image: "/images/image16.jpeg",
  },
  {
    _id: "fallback-2",
    name: "Deformed Steel Bar D12",
    category: "Steel & Reinforcement",
    brand: "Titan Steel",
    price: "650",
    location: "Nairobi",
    paymentPlan: "Cash or Credit",
    image: "/images/image17.jpeg",
  },
  {
    _id: "fallback-3",
    name: "Mabati Corrugated Sheet",
    category: "Roofing Materials",
    brand: "RoofMaster",
    price: "1,350",
    location: "Mombasa",
    paymentPlan: "Cash or Credit",
    image: "/images/image3.jpeg",
  },
  {
    _id: "fallback-4",
    name: "PVC Pipe 3/4 inch",
    category: "Plumbing Supplies",
    brand: "PolyFlow",
    price: "180",
    location: "Athi River",
    paymentPlan: "Cash or Credit",
    image: "/images/image25.jpeg",
  },
];

let cachedProducts = null;

async function fetchProducts() {
  if (cachedProducts) return cachedProducts;
  try {
    const res = await API.get("/products"); // backend API endpoint
    cachedProducts = Array.isArray(res.data) ? res.data : fallbackProducts;
    return cachedProducts;
  } catch (err) {
    console.error("❌ Failed to fetch products, falling back to static data", err);
    cachedProducts = fallbackProducts;
    return cachedProducts;
  }
}

export default fetchProducts;
