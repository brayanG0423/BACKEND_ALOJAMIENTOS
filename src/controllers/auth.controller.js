import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const buildToken = (user) => {
  return jwt.sign(
    { id: user.id, rol: user.rol, nombre: user.nombre },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const register = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;
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
      [nombre, correo, hash, "cliente"]
    );

    const user = { id: result.insertId, nombre, rol: "cliente" };
    const token = buildToken(user);
    res.status(201).json({ mensaje: "Usuario creado", token, user });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al registrar" });
  }
};

export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) {
      return res.status(400).json({ mensaje: "Datos incompletos" });
    }

    const [rows] = await pool.query(
      "SELECT id, nombre, correo, password_hash, rol FROM usuarios WHERE correo = ?",
      [correo]
    );
    if (rows.length === 0) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const token = buildToken(user);
    res.json({
      mensaje: "Login correcto",
      token,
      user: { id: user.id, nombre: user.nombre, rol: user.rol, correo: user.correo },
    });
  } catch (err) {
    res.status(500).json({ mensaje: "Error en login" });
  }
};

export const me = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, correo, rol, created_at FROM usuarios WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener usuario" });
  }
};
