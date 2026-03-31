import { NavLink } from "react-router-dom";

const Sidebar = ({ collapsed }) => {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">◆</div>
        <div>
          <p className="brand-title">STAYCONECT</p>
          <p className="brand-sub">Alojamientos</p>
        </div>
      </div>
      <nav className="nav">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/alojamientos">Alojamientos</NavLink>
        <NavLink to="/reservas">Reservas</NavLink>
        <NavLink to="/pagos">Pagos</NavLink>
        <NavLink to="/resenas">Reseñas</NavLink>
        <NavLink to="/usuarios">Usuarios</NavLink>
        <NavLink to="/disponibilidad">Disponibilidad</NavLink>
      </nav>
      {collapsed && <div className="sidebar-hint">Menú oculto</div>}
    </aside>
  );
};

export default Sidebar;
