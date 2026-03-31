import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError("No se pudo registrar");
    }
  };

  return (
    <div className="auth">
      <div className="auth-card">
        <h1>Crear cuenta</h1>
        <p>Regístrate para empezar a gestionar tus alojamientos.</p>
        <form onSubmit={handleSubmit} className="form">
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
          {error && <p className="error">{error}</p>}
          <button className="primary" type="submit">
            Crear cuenta
          </button>
        </form>
        <p className="muted">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
