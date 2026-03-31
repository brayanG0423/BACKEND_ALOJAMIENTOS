import { useEffect, useState } from "react";
import client from "../api/client";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    alojamientos: 0,
    reservas: 0,
    pagos: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [alo, res, pag] = await Promise.all([
          client.get("/alojamientos"),
          client.get("/reservas"),
          client.get("/pagos"),
        ]);
        setStats({
          alojamientos: alo.data.length,
          reservas: res.data.length,
          pagos: pag.data.length,
        });
      } catch (err) {
        setStats({ alojamientos: 0, reservas: 0, pagos: 0 });
      }
    };
    loadStats();
  }, []);

  return (
    <section className="section">
      <h2>Resumen general</h2>
      <div className="stats">
        <div className="stat-card">
          <p>Alojamientos</p>
          <h3>{stats.alojamientos}</h3>
        </div>
        <div className="stat-card">
          <p>Reservas</p>
          <h3>{stats.reservas}</h3>
        </div>
        <div className="stat-card">
          <p>Pagos</p>
          <h3>{stats.pagos}</h3>
        </div>
      </div>
      <div className="note">
        <p>
          Desde aquí puedes crear alojamientos, manejar reservas y registrar
          pagos. Todo listo para conectar un calendario o pasarela real.
        </p>
      </div>
    </section>
  );
};

export default DashboardPage;
