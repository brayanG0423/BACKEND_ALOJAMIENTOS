import { useEffect, useMemo, useState } from "react";
import client from "../api/client";

const isActiveReservation = (reserva) => {
  const today = new Date();
  const start = new Date(reserva.fecha_inicio);
  const end = new Date(reserva.fecha_fin);
  return start <= today && today <= end && reserva.estado !== "cancelada";
};

const DisponibilidadPage = () => {
  const [alojamientos, setAlojamientos] = useState([]);
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [alo, res] = await Promise.all([
        client.get("/alojamientos"),
        client.get("/reservas"),
      ]);
      setAlojamientos(alo.data);
      setReservas(res.data);
    };
    load();
  }, []);

  const disponibilidad = useMemo(() => {
    const byAlojamiento = reservas.reduce((acc, r) => {
      acc[r.alojamiento_id] = acc[r.alojamiento_id] || [];
      acc[r.alojamiento_id].push(r);
      return acc;
    }, {});

    return alojamientos.map((a) => {
      const list = byAlojamiento[a.id] || [];
      const active = list.find((r) => isActiveReservation(r));
      const next = list
        .filter((r) => new Date(r.fecha_inicio) > new Date())
        .sort((x, y) => new Date(x.fecha_inicio) - new Date(y.fecha_inicio))[0];
      return {
        ...a,
        activo: active,
        proximo: next,
      };
    });
  }, [alojamientos, reservas]);

  return (
    <section className="section">
      <h2>Disponibilidad de cuartos</h2>
      <div className="table table-availability">
        <div className="table-head">
          <span>Alojamiento</span>
          <span>Ciudad</span>
          <span>Estado</span>
          <span>Reserva activa</span>
          <span>Proxima reserva</span>
        </div>
        {disponibilidad.map((item) => (
          <div className="table-row" key={item.id}>
            <span>{item.titulo}</span>
            <span>{item.ciudad || "-"}</span>
            <span className="badge">{item.estado}</span>
            <span>
              {item.activo
                ? `${item.activo.fecha_inicio} → ${item.activo.fecha_fin}`
                : "Sin reserva"}
            </span>
            <span>
              {item.proximo
                ? `${item.proximo.fecha_inicio} → ${item.proximo.fecha_fin}`
                : "Sin reserva"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DisponibilidadPage;
