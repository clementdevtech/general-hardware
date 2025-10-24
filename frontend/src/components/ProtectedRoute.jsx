import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="text-center mt-5">Checking permissions...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  return children
}