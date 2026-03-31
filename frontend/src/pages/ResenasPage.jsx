import { useEffect, useState } from "react";
import client from "../api/client";

const ResenasPage = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    alojamiento_id: "",
    rating: 5,
    comentario: "",
  });

  const load = async () => {
    const { data } = await client.get("/resenas");
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await client.post("/resenas", form);
    setForm({ alojamiento_id: "", rating: 5, comentario: "" });
    load();
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Eliminar esta reseña?");
    if (!ok) return;
    await client.delete(`/resenas/${id}`);
    load();
  };

  return (
    <section className="section">
      <h2>Reseñas</h2>
      <div className="panel">
        <form onSubmit={handleSubmit} className="form grid-form">
          <label>
            ID alojamiento
            <input
              name="alojamiento_id"
              value={form.alojamiento_id}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Rating
            <input
              type="number"
              name="rating"
              min="1"
              max="5"
              value={form.rating}
              onChange={handleChange}
            />
          </label>
          <label>
            Comentario
            <input
              name="comentario"
              value={form.comentario}
              onChange={handleChange}
            />
          </label>
          <button className="primary" type="submit">
            Crear reseña
          </button>
        </form>
      </div>

      <div className="table">
        <div className="table-head">
          <span>ID</span>
          <span>Alojamiento</span>
          <span>Rating</span>
          <span>Comentario</span>
          <span>Acciones</span>
        </div>
        {items.map((item) => (
          <div className="table-row" key={item.id}>
            <span>#{item.id}</span>
            <span>{item.alojamiento || item.alojamiento_id}</span>
            <span>{item.rating}</span>
            <span>{item.comentario || "-"}</span>
            <button className="ghost danger" onClick={() => handleDelete(item.id)}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResenasPage;
