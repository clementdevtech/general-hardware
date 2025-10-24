import API from "../api";

// Public
export const getBlogs = () => API.get("/blogs");
export const getBlog = (slug) => API.get(`/blogs/${slug}`);

// Admin
export const addBlog = (formData) =>
  API.post("/blogs", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const updateBlog = (slug, formData) =>
  API.put(`/blogs/${slug}`, formData, { headers: { "Content-Type": "multipart/form-data" } });

export const deleteBlog = (slug) => API.delete(`/blogs/${slug}`);

// Users
export const addComment = (slug, text) =>
  API.post(`/blogs/${slug}/comments`, { text });

export const addReply = (slug, commentId, text) =>
  API.post(`/blogs/${slug}/comments/${commentId}/replies`, { text });

export const toggleReaction = (slug, type) =>
  API.post(`/blogs/${slug}/reactions`, { type });
