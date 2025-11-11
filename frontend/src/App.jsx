import React from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { CSSTransition, TransitionGroup } from "react-transition-group"

// import Header from "./components/Header"
// import Footer from "./components/Footer"

// import Home from "./pages/Home"
// import Products from "./pages/Products"
// import Services from "./pages/Services"
// import Gallery from "./pages/Gallery"
// import Blog from "./pages/Blog"
// import BlogDetails from "./pages/BlogDetails"
// import Contact from "./pages/Contact"
// import Cart from "./pages/Cart"
// import Login from "./pages/Login"
// import Register from "./pages/Register"

// import AdminLayout from "./pages/Admin/AdminLayout"
// import AdminBlogForm from "./pages/Admin/AdminBlogForm"
// import AdminServices from "./pages/Admin/AdminServices"
// import AdminProductForm from "./pages/Admin/AdminProductForm"
// import ManageBlogs from "./pages/Admin/ManageBlogs"
// import ManageProducts from "./pages/Admin/ManageProducts"

// import ProtectedRoute from "./components/ProtectedRoute"
import AuthProvider from "./context/AuthContext"

import "./App.css"

function AnimatedRoutes() {
  const location = useLocation()
  const nodeRef = React.useRef(null)

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={location.pathname}
        classNames="page"
        timeout={500}
        nodeRef={nodeRef}
      >
        <div ref={nodeRef}>
          <Routes location={location}>
            {/* All routes are commented out. Showing page missing message */}
            <Route
              path="*"
              element={
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <h2>Page Missing</h2>
                  <p>This page is currently unavailable.</p>
                </div>
              }
            />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* <Header /> */}
        <main className="flex-grow-1">
          <AnimatedRoutes />
        </main>
        {/* <Footer /> */}
      </Router>
    </AuthProvider>
  )
}

export default App
