import { pool } from "../config/db.js";

const nightsBetween = (start, end) => {
  const ms = new Date(end) - new Date(start);
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
};

export const getReservas = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, a.titulo as alojamiento, u.nombre as cliente
       FROM reservas r
       LEFT JOIN alojamientos a ON a.id = r.alojamiento_id
       LEFT JOIN usuarios u ON u.id = r.usuario_id
       ORDER BY r.id DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al listar reservas" });
  }
};

export const getReservaById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT r.*, a.titulo as alojamiento, u.nombre as cliente
       FROM reservas r
       LEFT JOIN alojamientos a ON a.id = r.alojamiento_id
       LEFT JOIN usuarios u ON u.id = r.usuario_id
       WHERE r.id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Reserva no encontrada" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener reserva" });
  }
};

export const createReserva = async (req, res) => {
  try {
    const { alojamiento_id, usuario_id, fecha_inicio, fecha_fin, huespedes } =
      req.body;
    if (!alojamiento_id || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ mensaje: "Datos incompletos" });
    }

    const [alo] = await pool.query(
      "SELECT precio_noche FROM alojamientos WHERE id = ?",
      [alojamiento_id]
    );
    if (alo.length === 0) {
      return res.status(404).json({ mensaje: "Alojamiento no encontrado" });
    }

    const noches = nightsBetween(fecha_inicio, fecha_fin);
    const total = noches * Number(alo[0].precio_noche);

    const [result] = await pool.query(
      `INSERT INTO reservas
      (alojamiento_id, usuario_id, fecha_inicio, fecha_fin, huespedes, estado, total)
      VALUES (?,?,?,?,?,?,?)`,
      [
        alojamiento_id,
        usuario_id || req.user?.id || null,
        fecha_inicio,
        fecha_fin,
        huespedes || 1,
        "pendiente",
        total,
      ]
    );
    res.status(201).json({ mensaje: "Reserva creada", id: result.insertId });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al crear reserva" });
  }
};

export const updateReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_inicio, fecha_fin, huespedes, estado } = req.body;
    const [result] = await pool.query(
      `UPDATE reservas
       SET fecha_inicio = COALESCE(?, fecha_inicio),
           fecha_fin = COALESCE(?, fecha_fin),
           huespedes = COALESCE(?, huespedes),
           estado = COALESCE(?, estado)
       WHERE id = ?`,
      [fecha_inicio, fecha_fin, huespedes, estado, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Reserva no encontrada" });
    }
    res.json({ mensaje: "Actualizada" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al actualizar reserva" });
  }
};

export const deleteReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM reservas WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Reserva no encontrada" });
    }
    res.json({ mensaje: "Eliminada" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al eliminar reserva" });
  }
};
