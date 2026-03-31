import { pool } from "../config/db.js";

export const getPagos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, r.total as reserva_total, u.nombre as cliente
       FROM pagos p
       LEFT JOIN reservas r ON r.id = p.reserva_id
       LEFT JOIN usuarios u ON u.id = r.usuario_id
       ORDER BY p.id DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al listar pagos" });
  }
};

export const getPagoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM pagos WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Pago no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener pago" });
  }
};

export const createPago = async (req, res) => {
  try {
    const { reserva_id, monto, metodo, referencia, estado } = req.body;
    if (!reserva_id || !monto || !metodo) {
      return res.status(400).json({ mensaje: "Datos incompletos" });
    }

    const [result] = await pool.query(
      `INSERT INTO pagos (reserva_id, monto, metodo, referencia, estado)
       VALUES (?,?,?,?,?)`,
      [reserva_id, monto, metodo, referencia || "", estado || "aprobado"]
    );

    await pool.query(
      "UPDATE reservas SET estado = ? WHERE id = ?",
      ["pagada", reserva_id]
    );

    res.status(201).json({ mensaje: "Pago registrado", id: result.insertId });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al registrar pago" });
  }
};

export const updatePago = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto, metodo, referencia, estado } = req.body;
    const [result] = await pool.query(
      `UPDATE pagos
       SET monto = COALESCE(?, monto),
           metodo = COALESCE(?, metodo),
           referencia = COALESCE(?, referencia),
           estado = COALESCE(?, estado)
       WHERE id = ?`,
      [monto, metodo, referencia, estado, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Pago no encontrado" });
    }
    res.json({ mensaje: "Pago actualizado" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al actualizar pago" });
  }
};

export const deletePago = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM pagos WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Pago no encontrado" });
    }
    res.json({ mensaje: "Pago eliminado" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al eliminar pago" });
  }
};
