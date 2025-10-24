import { useEffect, useState } from "react";
import { getBlogs } from "../services/blogService";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getBlogs().then((res) => setBlogs(res.data));
  }, []);

  return (
    <div>
      <h1>Blogs</h1>
      {blogs.map((blog) => (
        <div key={blog._id}>
          <h2>{blog.title}</h2>
          <img
            src={`data:image/jpeg;base64,${blog.coverImage}`}
            alt={blog.title}
            style={{ width: "200px" }}
          />
          <p>{blog.excerpt}</p>
        </div>
      ))}
    </div>
  );
}
