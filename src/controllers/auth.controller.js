import { connection } from "../config/db.js";
import jwt from "jsonwebtoken";

export const login = (req, res) => {
  const { correo, password } = req.body;

  const sql =
    "SELECT * FROM usuarios WHERE correo=? AND password=?";

  connection.query(sql, [correo, password], (err, result) => {
    if (result.length > 0) {
      const token = jwt.sign(
        { id: result[0].id },
        process.env.JWT_SECRET
      );

      res.json({
        mensaje: "Login correcto",
        token,
      });
    } else {
      res.send("Datos incorrectos");
    }
  });
};