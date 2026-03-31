import { useEffect, useState } from "react";
import client from "../api/client";
import { formatCOP } from "../utils/format";

const PagosPage = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    reserva_id: "",
    monto: "",
    metodo: "tarjeta",
    referencia: "",
  });

  const load = async () => {
    const { data } = await client.get("/pagos");
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
    await client.post("/pagos", form);
    setForm({ reserva_id: "", monto: "", metodo: "tarjeta", referencia: "" });
    load();
  };

  return (
    <section className="section">
      <h2>Pagos</h2>
      <div className="panel">
        <form onSubmit={handleSubmit} className="form grid-form">
          <label>
            ID reserva
            <input
              name="reserva_id"
              value={form.reserva_id}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Monto
            <input
              type="number"
              name="monto"
              value={form.monto}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Método
            <select name="metodo" value={form.metodo} onChange={handleChange}>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
              <option value="efectivo">Efectivo</option>
              <option value="paypal">Paypal</option>
            </select>
          </label>
          <label>
            Referencia
            <input
              name="referencia"
              value={form.referencia}
              onChange={handleChange}
            />
          </label>
          <button className="primary" type="submit">
            Registrar pago
          </button>
        </form>
      </div>

      <div className="table">
        <div className="table-head">
          <span>ID</span>
          <span>Reserva</span>
          <span>Monto</span>
          <span>Método</span>
          <span>Estado</span>
        </div>
        {items.map((item) => (
          <div className="table-row" key={item.id}>
            <span>#{item.id}</span>
            <span>{item.reserva_id}</span>
            <span>{formatCOP(item.monto)}</span>
            <span>{item.metodo}</span>
            <span className="badge">{item.estado}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PagosPage;
