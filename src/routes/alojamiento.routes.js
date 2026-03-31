import { Router } from "express";
import {
  getAlojamientos,
  getAlojamientoById,
  createAlojamiento,
  updateAlojamiento,
  deleteAlojamiento,
} from "../controllers/alojamiento.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/", getAlojamientos);
router.get("/:id", getAlojamientoById);
router.post("/", authRequired, createAlojamiento);
router.put("/:id", authRequired, updateAlojamiento);
router.delete("/:id", authRequired, deleteAlojamiento);

export default router;
