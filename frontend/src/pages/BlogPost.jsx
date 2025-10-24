import { useParams, Link } from "react-router-dom"
import { FaArrowLeft, FaWhatsapp } from "react-icons/fa"

// ✅ Blog data (can later move to a separate data file or backend)
const posts = [
  {
    title: "How We Transform Suburban Living",
    content: `
      At Baraka Homes, we specialize in rethinking how Nairobi residents experience suburban living.
      
      Our projects focus on **affordability, durability, and comfort**, ensuring each home blends modern design with practical value. 

      Through partnerships and innovations, we bring quality homes closer to families who need them most.
    `,
    img: "/images/house7.jpeg",
    date: "Sept 2025",
    slug: "transform-suburban-living"
  },
  {
    title: "Choosing the Right Home for Your Family",
    content: `
      Buying a home isn’t just about space—it’s about finding a place that fits your lifestyle.
      
      - **Kilimani & Kileleshwa** are great for modern families wanting access to schools and shopping.
      - **Suburban estates** provide more outdoor space and privacy.

      Our agents guide you every step of the way to ensure you make the best choice for your family.
    `,
    img: "/images/house11.jpeg",
    date: "Aug 2025",
    slug: "choosing-right-home"
  },
  {
    title: "Affordable Housing Solutions in Nairobi",
    content: `
      Affordable housing has become a cornerstone of Nairobi’s real estate demand. 

      Baraka Homes is proud to support communities by offering **durable, modern homes** that remain within reach of working families. 

      Together, we are building not just houses, but futures.
    `,
    img: "/images/house12.jpeg",
    date: "July 2025",
    slug: "affordable-housing"
  }
]

export default function BlogPost() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="container py-5 text-center">
        <h2 className="fw-bold">Post Not Found</h2>
        <p className="text-muted">The blog post you’re looking for doesn’t exist.</p>
        <Link to="/blog" className="btn btn-success mt-3">
          Back to Blog
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* ✅ Banner */}
      <section className="bg-success text-white text-center py-5">
        <h1 className="display-4 fw-bold">{post.title}</h1>
        <p className="lead">{post.date}</p>
      </section>

      {/* ✅ Blog Content */}
      <section className="container py-5">
        <Link to="/blog" className="btn btn-outline-secondary mb-4">
          <FaArrowLeft /> Back to Blog
        </Link>

        <div className="card shadow-sm border-0">
          <img src={post.img} alt={post.title} className="card-img-top" />
          <div className="card-body">
            <h2 className="fw-bold mb-3">{post.title}</h2>
            <p className="text-muted small">{post.date}</p>
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br/>") }}
            />
          </div>
        </div>
      </section>

      {/* ✅ Floating WhatsApp CTA */}
      <a
        href="https://wa.me/254746415223?text=Hello%20Baraka%20Homes%2C%20I%27d%20like%20to%20learn%20more%20about%20your%20blog%20insights."
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-success rounded-circle shadow-lg"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          width: "60px",
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px"
        }}
      >
        <FaWhatsapp />
      </a>
    </div>
  )
}