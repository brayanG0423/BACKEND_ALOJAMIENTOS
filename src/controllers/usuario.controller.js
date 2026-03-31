import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";

export const getUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, correo, rol, created_at FROM usuarios ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al listar usuarios" });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT id, nombre, correo, rol, created_at FROM usuarios WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener usuario" });
  }
};

export const createUsuario = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;
    if (!nombre || !correo || !password) {
      return res.status(400).json({ mensaje: "Datos incompletos" });
    }
    const [existing] = await pool.query(
      "SELECT id FROM usuarios WHERE correo = ?",
      [correo]
    );
    if (existing.length > 0) {
      return res.status(409).json({ mensaje: "Correo ya registrado" });
    }

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, correo, password_hash, rol) VALUES (?,?,?,?)",
      [nombre, correo, hash, rol || "cliente"]
    );
    res.status(201).json({ mensaje: "Usuario creado", id: result.insertId });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al crear usuario" });
  }
};

export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, rol } = req.body;
    const [result] = await pool.query(
      "UPDATE usuarios SET nombre = COALESCE(?, nombre), correo = COALESCE(?, correo), rol = COALESCE(?, rol) WHERE id = ?",
      [nombre, correo, rol, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json({ mensaje: "Actualizado" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al actualizar usuario" });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM usuarios WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json({ mensaje: "Eliminado" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al eliminar usuario" });
  }
};
