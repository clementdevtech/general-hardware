import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get("/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <p>Loading blogs...</p>;

  if (!blogs || blogs.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>📰 Blog</h2>
        <p className="mt-4 text-muted">Coming soon... No blogs have been posted yet.</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">📰 Our Blog</h2>
      <div className="row g-4">
        {blogs.map((blog) => (
          <div className="col-md-4" key={blog._id}>
            <div className="card h-100 shadow-sm">
              {/* ✅ Cover or first image */}
              {blog.coverImage ? (
                <img
                  src={blog.coverImage.url || blog.coverImage}
                  alt={blog.title}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              ) : blog.images?.length ? (
                <img
                  src={blog.images[0]}
                  alt={blog.title}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              ) : null}

              <div className="card-body">
                <h5 className="card-title">{blog.title}</h5>
                <p className="card-text">
                  {blog.content.substring(0, 120)}...
                </p>
                <Link to={`/blog/${blog.slug}`} className="btn btn-primary">
                  Read More →
                </Link>
              </div>

              <div className="card-footer text-muted">
                {new Date(blog.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}