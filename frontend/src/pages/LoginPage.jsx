import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(correo, password);
      navigate("/");
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="auth">
      <div className="auth-card">
        <h1>Inicia sesión</h1>
        <p>Accede al panel para gestionar alojamientos y reservas.</p>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Correo
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="primary" type="submit">
            Entrar
          </button>
        </form>
        <p className="muted">
          ¿No tienes cuenta? <Link to="/register">Crear una</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
