import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getBlogs, deleteBlog } from "../../services/blogService"
import AdminSidebar from "../../components/AdminSidebar"

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([])

  const fetchBlogs = async () => {
    const res = await getBlogs()
    setBlogs(res.data)
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleDelete = async (slug) => {
    if (window.confirm("Delete this blog?")) {
      await deleteBlog(slug)
      fetchBlogs()
    }
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h2>Manage Blogs</h2>
        <Link to="/admin/blogs/new" className="btn">➕ Add Blog</Link>
        <ul>
          {blogs.map((b) => (
            <li key={b._id}>
              {b.title}
              <Link to={`/admin/blogs/edit/${b.slug}`}>✏️ Edit</Link>
              <button onClick={() => handleDelete(b.slug)}>🗑️ Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
