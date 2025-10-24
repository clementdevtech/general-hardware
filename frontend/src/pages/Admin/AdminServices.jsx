import { useEffect, useState } from "react"
import API from "../../api"

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    API.get("/services").then((res) => setServices(res.data))
  }, [])

  const handleAdd = async () => {
    await API.post("/services", { name, description })
    const res = await API.get("/services")
    setServices(res.data)
    setName("")
    setDescription("")
  }

  const handleDelete = async (id) => {
    await API.delete(`/services/${id}`)
    setServices(services.filter((s) => s._id !== id))
  }

  return (
    <div>
      <h2>Manage Services</h2>

      <div className="mb-3">
        <input
          className="form-control mb-2"
          placeholder="Service Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleAdd}>Add Service</button>
      </div>

      <ul className="list-group">
        {services.map((s) => (
          <li
            key={s._id}
            className="list-group-item d-flex justify-content-between"
          >
            {s.name}
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
