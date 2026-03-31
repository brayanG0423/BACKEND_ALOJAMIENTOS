import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <div className="logo">◆</div>
        <div>
          <p className="brand-title">STAYCONECT</p>
          <p className="brand-sub">Bienvenido a STAYCONECT</p>
        </div>
      </div>
      <nav className="top-nav">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/alojamientos">Alojamientos</NavLink>
        <NavLink to="/reservas">Reservas</NavLink>
        <NavLink to="/pagos">Pagos</NavLink>
        <NavLink to="/resenas">Reseñas</NavLink>
        <NavLink to="/usuarios">Usuarios</NavLink>
        <NavLink to="/disponibilidad">Disponibilidad</NavLink>
      </nav>
      <div className="topbar-actions">
        <div className="user-pill">{user?.nombre || "Equipo STAYCONECT"}</div>
        <button className="ghost" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Topbar;
