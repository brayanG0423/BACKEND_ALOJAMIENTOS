import { pool } from "../config/db.js";

export const getImagenes = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT i.*, a.titulo as alojamiento
       FROM imagenes i
       LEFT JOIN alojamientos a ON a.id = i.alojamiento_id
       ORDER BY i.id DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al listar imágenes" });
  }
};

export const createImagen = async (req, res) => {
  try {
    const { alojamiento_id, url } = req.body;
    if (!alojamiento_id || !url) {
      return res.status(400).json({ mensaje: "Datos incompletos" });
    }
    const [result] = await pool.query(
      "INSERT INTO imagenes (alojamiento_id, url) VALUES (?,?)",
      [alojamiento_id, url]
    );
    res.status(201).json({ mensaje: "Imagen creada", id: result.insertId });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al crear imagen" });
  }
};

export const deleteImagen = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM imagenes WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Imagen no encontrada" });
    }
    res.json({ mensaje: "Imagen eliminada" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al eliminar imagen" });
  }
};
