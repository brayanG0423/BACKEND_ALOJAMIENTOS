import { connection } from "../config/db.js";

export const getUsuarios = (req, res) => {
  connection.query("SELECT * FROM usuarios", (err, result) => {
    if (err) return res.send(err);
    res.json(result);
  });
};

export const createUsuario = (req, res) => {
  const { nombre, correo, password } = req.body;

  const sql =
    "INSERT INTO usuarios(nombre, correo, password) VALUES (?,?,?)";

  connection.query(sql, [nombre, correo, password], (err) => {
    if (err) return res.send(err);
    res.send("Usuario creado");
  });
};

export const updateUsuario = (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  const sql = "UPDATE usuarios SET nombre=? WHERE id=?";

  connection.query(sql, [nombre, id], (err) => {
    if (err) return res.send(err);
    res.send("Actualizado");
  });
};

export const deleteUsuario = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM usuarios WHERE id=?";

  connection.query(sql, [id], (err) => {
    if (err) return res.send(err);
    res.send("Eliminado");
  });
};