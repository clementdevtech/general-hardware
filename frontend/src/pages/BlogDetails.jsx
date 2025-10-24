import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Slider from "react-slick";
import API from "../api";

export default function BlogDetails() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [reply, setReply] = useState({});
  const [reactions, setReactions] = useState({ likes: 0, hearts: 0, dislikes: 0 });
  const [userReactions, setUserReactions] = useState({ like: false, heart: false, dislike: false });

  useEffect(() => {
    fetchBlog();
    fetchAllBlogs();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const res = await API.get(`/blogs/${slug}`);
      setBlog(res.data);
      setReactions(res.data.reactions || { likes: 0, hearts: 0, dislikes: 0 });
      setUserReactions(res.data.userReactions || { like: false, heart: false, dislike: false });
    } catch (err) {
      console.error("Error fetching blog:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllBlogs = async () => {
    try {
      const res = await API.get("/blogs");
      setAllBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/blogs/${slug}/comments`, { text: comment });
      setComment("");
      fetchBlog();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleReply = async (commentId) => {
    if (!reply[commentId]) return;
    try {
      await API.post(`/blogs/${slug}/comments/${commentId}/replies`, {
        text: reply[commentId],
      });
      setReply({ ...reply, [commentId]: "" });
      fetchBlog();
    } catch (err) {
      console.error("Error adding reply:", err);
    }
  };

  const handleReaction = async (type) => {
    try {
      const res = await API.post(`/blogs/${slug}/reactions`, { type });
      setReactions(res.data.reactions);
      setUserReactions(res.data.userReactions);
    } catch (err) {
      console.error("Error reacting:", err);
    }
  };

  if (loading) return <p>Loading blog...</p>;
  if (!blog) return <p>Blog not found.</p>;

  // --- 🧠 Split content into paragraphs ---
  const paragraphs = blog.content?.split(/\r?\n\r?\n/) || [];

  // Slider config
  const sliderSettings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="container py-5">
      {/* Title */}
      <h2 className="mb-3">{blog.title}</h2>

      {/* Cover Image */}
      {blog.coverImage && (
        <img
          src={blog.coverImage.url || blog.coverImage}
          alt={blog.title}
          className="img-fluid mb-4 rounded shadow-sm"
          style={{ maxHeight: "450px", objectFit: "cover", width: "100%" }}
        />
      )}

      {/* Content with inline images */}
      <div className="blog-content mb-4" style={{ lineHeight: "1.7", fontSize: "1.05rem" }}>
        {paragraphs.map((para, index) => (
          <div key={index} className="mb-4">
            <p>{para}</p>

            {/* Insert image after each paragraph (if any remain) */}
            {blog.images && blog.images[index] && (
              <img
                src={blog.images[index]}
                alt={blog.title}
                className="img-fluid rounded my-3 shadow-sm"
                style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Reactions */}
      <div className="my-3 d-flex gap-2">
        <button
          className={`btn ${userReactions.like ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => handleReaction("like")}
        >
          👍 {reactions.likes}
        </button>
        <button
          className={`btn ${userReactions.heart ? "btn-danger" : "btn-outline-danger"}`}
          onClick={() => handleReaction("heart")}
        >
          ❤️ {reactions.hearts}
        </button>
        <button
          className={`btn ${userReactions.dislike ? "btn-dark" : "btn-outline-dark"}`}
          onClick={() => handleReaction("dislike")}
        >
          👎 {reactions.dislikes}
        </button>
      </div>

      <hr />
      <h4>Comments</h4>
      <form onSubmit={handleComment} className="mb-3">
        <textarea
          className="form-control mb-2"
          rows="3"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="btn btn-success">Submit</button>
      </form>

      {blog.comments && blog.comments.length > 0 ? (
        <ul className="list-group">
          {blog.comments.map((c) => (
            <li key={c._id} className="list-group-item">
              <strong>{c.user?.username || "Anonymous"}</strong>: {c.text}
              <div className="text-muted small">{new Date(c.createdAt).toLocaleString()}</div>

              {/* Replies */}
              {c.replies && c.replies.length > 0 && (
                <ul className="mt-2 ps-3 border-start">
                  {c.replies.map((r) => (
                    <li key={r._id}>
                      <strong>{r.user?.username || "Anonymous"}</strong>: {r.text}
                      <div className="text-muted small">{new Date(r.createdAt).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Reply form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleReply(c._id);
                }}
                className="mt-2"
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder="Write a reply..."
                  value={reply[c._id] || ""}
                  onChange={(e) => setReply({ ...reply, [c._id]: e.target.value })}
                />
                <button className="btn btn-sm btn-primary mt-1">Reply</button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet. Be the first!</p>
      )}

      <hr />
      <h4>More Blogs</h4>
      <Slider {...sliderSettings}>
        {allBlogs.filter((b) => b.slug !== slug).map((b) => (
          <div key={b._id} className="p-2">
            <div className="card h-100 shadow-sm">
              {b.coverImage && (
                <img
                  src={b.coverImage.url || b.coverImage}
                  alt={b.title}
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h6>{b.title}</h6>
                <Link to={`/blog/${b.slug}`} className="btn btn-sm btn-primary">
                  Read →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
