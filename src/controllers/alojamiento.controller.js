import { pool } from "../config/db.js";

export const getAlojamientos = async (req, res) => {
  try {
    const { ciudad, estado } = req.query;
    const filters = [];
    const params = [];
    if (ciudad) {
      filters.push("a.ciudad = ?");
      params.push(ciudad);
    }
    if (estado) {
      filters.push("a.estado = ?");
      params.push(estado);
    }
    const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    const [rows] = await pool.query(
      `SELECT a.*, u.nombre as propietario
       FROM alojamientos a
       LEFT JOIN usuarios u ON u.id = a.propietario_id
       ${where}
       ORDER BY a.id DESC`,
      params
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al listar alojamientos" });
  }
};

export const getAlojamientoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT a.*, u.nombre as propietario
       FROM alojamientos a
       LEFT JOIN usuarios u ON u.id = a.propietario_id
       WHERE a.id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Alojamiento no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener alojamiento" });
  }
};

export const createAlojamiento = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      direccion,
      ciudad,
      pais,
      precio_noche,
      capacidad,
      estado,
      propietario_id,
    } = req.body;

    if (!titulo || !precio_noche || !capacidad) {
      return res.status(400).json({ mensaje: "Datos incompletos" });
    }

    const [result] = await pool.query(
      `INSERT INTO alojamientos
      (titulo, descripcion, direccion, ciudad, pais, precio_noche, capacidad, estado, propietario_id)
      VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        titulo,
        descripcion || "",
        direccion || "",
        ciudad || "",
        pais || "",
        precio_noche,
        capacidad,
        estado || "disponible",
        propietario_id || req.user?.id || null,
      ]
    );
    res.status(201).json({ mensaje: "Alojamiento creado", id: result.insertId });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al crear alojamiento" });
  }
};

export const updateAlojamiento = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      descripcion,
      direccion,
      ciudad,
      pais,
      precio_noche,
      capacidad,
      estado,
    } = req.body;

    const [result] = await pool.query(
      `UPDATE alojamientos
       SET titulo = COALESCE(?, titulo),
           descripcion = COALESCE(?, descripcion),
           direccion = COALESCE(?, direccion),
           ciudad = COALESCE(?, ciudad),
           pais = COALESCE(?, pais),
           precio_noche = COALESCE(?, precio_noche),
           capacidad = COALESCE(?, capacidad),
           estado = COALESCE(?, estado)
       WHERE id = ?`,
      [
        titulo,
        descripcion,
        direccion,
        ciudad,
        pais,
        precio_noche,
        capacidad,
        estado,
        id,
      ]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Alojamiento no encontrado" });
    }
    res.json({ mensaje: "Actualizado" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al actualizar alojamiento" });
  }
};

export const deleteAlojamiento = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM alojamientos WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Alojamiento no encontrado" });
    }
    res.json({ mensaje: "Eliminado" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al eliminar alojamiento" });
  }
};
