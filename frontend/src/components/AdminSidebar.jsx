import { Link } from "react-router-dom"

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <ul>
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/admin/blogs">Manage Blogs</Link></li>
          <li><Link to="/admin/products">Manage Products</Link></li>
        </ul>
      </nav>
    </aside>
  )
}
