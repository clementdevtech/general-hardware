import API from "../api";

let cachedProducts = null;


async function fetchProducts() {
  if (cachedProducts) return cachedProducts;
  try {
    const res = await API.get("/products"); // backend API endpoint
    cachedProducts = res.data;
    return cachedProducts;
  } catch (err) {
    console.error("❌ Failed to fetch products, falling back to static data", err);
  }
}

export default fetchProducts;