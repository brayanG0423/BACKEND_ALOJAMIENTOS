import { useEffect, useState } from "react";
import client from "../api/client";
import { formatCOP } from "../utils/format";

const initialForm = {
  titulo: "",
  ciudad: "",
  pais: "",
  precio_noche: "",
  capacidad: 1,
};

const suggestedPrice = (capacidad) => {
  const cap = Number(capacidad) || 1;
  if (cap <= 2) return 120000;
  if (cap <= 4) return 200000;
  if (cap <= 6) return 280000;
  if (cap <= 8) return 360000;
  return 450000;
};

const AlojamientosPage = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);

  const load = async () => {
    const { data } = await client.get("/alojamientos");
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => {
      if (name === "capacidad") {
        const precio = prev.precio_noche || suggestedPrice(value);
        return { ...prev, capacidad: value, precio_noche: precio };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await client.post("/alojamientos", form);
    setForm(initialForm);
    load();
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Eliminar este alojamiento?");
    if (!ok) return;
    await client.delete(`/alojamientos/${id}`);
    load();
  };

  const handleConfirm = async (id) => {
    const ok = window.confirm("¿Confirmar este alojamiento?");
    if (!ok) return;
    await client.put(`/alojamientos/${id}`, { estado: "disponible" });
    load();
  };

  return (
    <section className="section">
      <h2>Alojamientos</h2>
      <div className="panel">
        <form onSubmit={handleSubmit} className="form grid-form">
          <label>
            Titulo
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Ciudad
            <input name="ciudad" value={form.ciudad} onChange={handleChange} />
          </label>
          <label>
            Pais
            <input name="pais" value={form.pais} onChange={handleChange} />
          </label>
          <label>
            Precio noche
            <input
              type="number"
              name="precio_noche"
              value={form.precio_noche}
              onChange={handleChange}
              required
            />
            <span className="helper">
              Sugerido para {form.capacidad} personas:{" "}
              {formatCOP(suggestedPrice(form.capacidad))}
            </span>
          </label>
          <label>
            Capacidad
            <input
              type="number"
              name="capacidad"
              value={form.capacidad}
              onChange={handleChange}
            />
          </label>
          <button className="primary" type="submit">
            Crear alojamiento
          </button>
        </form>
      </div>

      <div className="table">
        <div className="table-head">
          <span>Titulo</span>
          <span>Ciudad</span>
          <span>Precio</span>
          <span>Capacidad</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>
        {items.map((item) => (
          <div className="table-row" key={item.id}>
            <span>{item.titulo}</span>
            <span>{item.ciudad || "-"}</span>
            <span>{formatCOP(item.precio_noche)}</span>
            <span>{item.capacidad}</span>
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

export default AlojamientosPage;
