import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { checkDb } from "./config/db.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import authRoutes from "./routes/auth.routes.js";
import alojamientoRoutes from "./routes/alojamiento.routes.js";
import reservaRoutes from "./routes/reserva.routes.js";
import pagoRoutes from "./routes/pago.routes.js";
import resenaRoutes from "./routes/resena.routes.js";
import imagenRoutes from "./routes/imagen.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/alojamientos", alojamientoRoutes);
app.use("/api/reservas", reservaRoutes);
app.use("/api/pagos", pagoRoutes);
app.use("/api/resenas", resenaRoutes);
app.use("/api/imagenes", imagenRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(3000, () => {
  console.log("Servidor corriendo");
  checkDb();
});
