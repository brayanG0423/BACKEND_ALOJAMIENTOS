import { useEffect, useState } from "react";
import client from "../api/client";

const UsuariosPage = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    rol: "cliente",
  });
  const [error, setError] = useState("");

  const load = async () => {
    const { data } = await client.get("/usuarios");
    setItems(data);
  };

  useEffect(() => {
    load().catch(() => setError("Necesitas rol admin para ver usuarios."));
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await client.post("/usuarios", form);
      setForm({ nombre: "", correo: "", password: "", rol: "cliente" });
      load();
    } catch (err) {
      setError("No se pudo crear el usuario");
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Eliminar este usuario?");
    if (!ok) return;
    try {
      await client.delete(`/usuarios/${id}`);
      load();
    } catch (err) {
      setError("No tienes permisos para eliminar usuarios.");
    }
  };

  return (
    <section className="section">
      <h2>Usuarios</h2>
      {error && <p className="error">{error}</p>}
      <div className="panel">
        <form onSubmit={handleSubmit} className="form grid-form">
          <label>
            Nombre
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Correo
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Rol
            <select name="rol" value={form.rol} onChange={handleChange}>
              <option value="admin">Admin</option>
              <option value="propietario">Propietario</option>
              <option value="cliente">Cliente</option>
            </select>
          </label>
          <button className="primary" type="submit">
            Crear usuario
          </button>
        </form>
      </div>

      <div className="table table-users">
        <div className="table-head">
          <span>Nombre</span>
          <span>Correo</span>
          <span>Rol</span>
          <span>Fecha</span>
          <span>Acciones</span>
        </div>
        {items.map((item) => (
          <div className="table-row" key={item.id}>
            <span>{item.nombre}</span>
            <span>{item.correo}</span>
            <span className="badge">{item.rol}</span>
            <span>{new Date(item.created_at).toLocaleDateString()}</span>
            <button className="ghost danger" onClick={() => handleDelete(item.id)}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UsuariosPage;
