import { Router } from "express";
import {
  getReservas,
  getReservaById,
  createReserva,
  updateReserva,
  deleteReserva,
} from "../controllers/reserva.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/", authRequired, getReservas);
router.get("/:id", authRequired, getReservaById);
router.post("/", authRequired, createReserva);
router.put("/:id", authRequired, updateReserva);
router.delete("/:id", authRequired, deleteReserva);

export default router;
