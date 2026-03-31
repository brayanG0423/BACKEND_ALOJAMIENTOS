import { pool } from "../config/db.js";

export const getResenas = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, a.titulo as alojamiento, u.nombre as cliente
       FROM resenas r
       LEFT JOIN alojamientos a ON a.id = r.alojamiento_id
       LEFT JOIN usuarios u ON u.id = r.usuario_id
       ORDER BY r.id DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al listar reseñas" });
  }
};

export const getResenaById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM resenas WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Reseña no encontrada" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener reseña" });
  }
};

export const createResena = async (req, res) => {
  try {
    const { alojamiento_id, usuario_id, rating, comentario } = req.body;
    if (!alojamiento_id || !rating) {
      return res.status(400).json({ mensaje: "Datos incompletos" });
    }
    const [result] = await pool.query(
      `INSERT INTO resenas (alojamiento_id, usuario_id, rating, comentario)
       VALUES (?,?,?,?)`,
      [alojamiento_id, usuario_id || req.user?.id || null, rating, comentario || ""]
    );
    res.status(201).json({ mensaje: "Reseña creada", id: result.insertId });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al crear reseña" });
  }
};

export const updateResena = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comentario } = req.body;
    const [result] = await pool.query(
      `UPDATE resenas
       SET rating = COALESCE(?, rating),
           comentario = COALESCE(?, comentario)
       WHERE id = ?`,
      [rating, comentario, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Reseña no encontrada" });
    }
    res.json({ mensaje: "Reseña actualizada" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al actualizar reseña" });
  }
};

export const deleteResena = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM resenas WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Reseña no encontrada" });
    }
    res.json({ mensaje: "Reseña eliminada" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al eliminar reseña" });
  }
};
