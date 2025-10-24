import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDropzone } from "react-dropzone"
import API from "../../api"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

export default function AdminBlogForm() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [images, setImages] = useState([]) // newly uploaded File[]
  const [imagePreviews, setImagePreviews] = useState([]) // local previews
  const [existingImages, setExistingImages] = useState([]) // from backend

  // ---------------- Fetch existing blog if editing ----------------
  useEffect(() => {
    if (slug) {
      const fetchBlog = async () => {
        try {
          const res = await API.get(`/blogs/${slug}`)
          const blog = res.data
          setTitle(blog.title || "")
          setContent(blog.content || "")
          if (blog.coverImage) setCoverPreview(blog.coverImage)
          setExistingImages(blog.images || [])
        } catch (err) {
          console.error("Error loading blog:", err)
        }
      }
      fetchBlog()
    }
  }, [slug])

  useEffect(() => {
  return () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url))
    if (coverPreview) URL.revokeObjectURL(coverPreview)
  }
}, [imagePreviews, coverPreview])


  // ---------------- Handle Cover Image ----------------
  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    const maxSize = 4 * 1024 * 1024 // 2 MB
    if (file && file.size > maxSize) {
      alert(`"${file.name}" is too large! Maximum allowed size is 2MB.`)
      e.target.value = ""
      return
    }
    setCoverImage(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  // ---------------- Handle Drag & Drop for extra images ----------------
  const onDrop = useCallback((acceptedFiles) => {
    const maxSize = 4 * 1024 * 1024
    const validFiles = []
    const previews = []

    acceptedFiles.forEach((file) => {
      if (file.size > maxSize) {
        alert(`"${file.name}" is too large! Maximum allowed size is 2MB.`)
      } else {
        validFiles.push(file)
        previews.push(URL.createObjectURL(file))
      }
    })

    setImages((prev) => [...prev, ...validFiles])
    setImagePreviews((prev) => [...prev, ...previews])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  })

  // ---------------- Reorder image previews (drag sorting) ----------------
  const handleReorder = (result) => {
    if (!result.destination) return
    const reordered = Array.from(imagePreviews)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)

    const reorderedFiles = Array.from(images)
    const [movedFile] = reorderedFiles.splice(result.source.index, 1)
    reorderedFiles.splice(result.destination.index, 0, movedFile)

    setImages(reorderedFiles)
    setImagePreviews(reordered)
  }

  // ---------------- Submit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)
    if (coverImage) formData.append("coverImage", coverImage)
    images.forEach((img) => formData.append("images", img))

    try {
      if (slug) {
        await API.put(`/blogs/${slug}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      } else {
        await API.post(`/blogs`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }
      navigate("/admin/blogs")
    } catch (err) {
      console.error("Error saving blog:", err)
      alert("Something went wrong while saving the blog.")
    }
  }

  // ---------------- Render ----------------
  return (
    <div className="container py-4">
      <h2 className="mb-4">{slug ? "Edit Blog" : "New Blog"}</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Content */}
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            rows="6"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {/* Cover Image */}
        <div className="mb-3">
          <label className="form-label">Cover Image (max 2MB)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleCoverChange}
          />
          {coverPreview && (
            <div className="mt-3">
              <img
                src={coverPreview}
                alt="Cover"
                style={{
                  width: "200px",
                  height: "150px",
                  objectFit: "cover",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                }}
              />
            </div>
          )}
        </div>

        {/* Existing Images */}
        {slug && existingImages.length > 0 && (
          <div className="mb-3">
            <label className="form-label">Existing Images</label>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {existingImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="existing"
                  style={{
                    width: "120px",
                    height: "90px",
                    objectFit: "cover",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                  }}
                />
              ))}
            </div>
            <small className="text-muted d-block mt-1">
              Uploading new images will replace these.
            </small>
          </div>
        )}

        {/* Drag & Drop for new images */}
        <div className="mb-3">
          <label className="form-label">Upload & Reorder Images</label>
          <div
            {...getRootProps()}
            className={`border p-4 text-center rounded ${
              isDragActive ? "bg-light border-primary" : "bg-white"
            }`}
            style={{ cursor: "pointer" }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the images here...</p>
            ) : (
              <p>
                Drag & drop images here, or click to select (max 2MB each)
              </p>
            )}
          </div>

          {/* Sortable preview area */}
          {imagePreviews.length > 0 && (
            <DragDropContext onDragEnd={handleReorder}>
              <Droppable droppableId="images">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="d-flex flex-wrap gap-2 mt-3"
                  >
                    {imagePreviews.map((src, idx) => (
                      <Draggable key={src} draggableId={src} index={idx}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <img
                              src={src}
                              alt="preview"
                              style={{
                                width: "120px",
                                height: "90px",
                                objectFit: "cover",
                                border: "2px solid #ccc",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>

        {/* Submit */}
        <button className="btn btn-primary">
          {slug ? "Update Blog" : "Create Blog"}
        </button>
      </form>
    </div>
  )
}
