import { useEffect, useState } from "react";
import client from "../api/client";
import { formatCOP } from "../utils/format";

const ReservasPage = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    alojamiento_id: "",
    fecha_inicio: "",
    fecha_fin: "",
    huespedes: 1,
  });

  const load = async () => {
    const { data } = await client.get("/reservas");
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
    await client.post("/reservas", form);
    setForm({ alojamiento_id: "", fecha_inicio: "", fecha_fin: "", huespedes: 1 });
    load();
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Eliminar esta reserva?");
    if (!ok) return;
    await client.delete(`/reservas/${id}`);
    load();
  };

  const handleConfirm = async (id) => {
    const ok = window.confirm("¿Confirmar esta reserva?");
    if (!ok) return;
    await client.put(`/reservas/${id}`, { estado: "confirmada" });
    load();
  };

  return (
    <section className="section">
      <h2>Reservas</h2>
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
            Fecha inicio
            <input
              type="date"
              name="fecha_inicio"
              value={form.fecha_inicio}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Fecha fin
            <input
              type="date"
              name="fecha_fin"
              value={form.fecha_fin}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Huéspedes
            <input
              type="number"
              name="huespedes"
              value={form.huespedes}
              onChange={handleChange}
            />
          </label>
          <button className="primary" type="submit">
            Crear reserva
          </button>
        </form>
      </div>

      <div className="table">
        <div className="table-head">
          <span>ID</span>
          <span>Alojamiento</span>
          <span>Fechas</span>
          <span>Total</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>
        {items.map((item) => (
          <div className="table-row" key={item.id}>
            <span>#{item.id}</span>
            <span>{item.alojamiento || item.alojamiento_id}</span>
            <span>
              {item.fecha_inicio} → {item.fecha_fin}
            </span>
            <span>{formatCOP(item.total)}</span>
            <span className="badge">{item.estado}</span>
            <div className="actions">
              <button className="ghost" onClick={() => handleConfirm(item.id)}>
                Confirmar
              </button>
              <button
                className="ghost danger"
                onClick={() => handleDelete(item.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReservasPage;
