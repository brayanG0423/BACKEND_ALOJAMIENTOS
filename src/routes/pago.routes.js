import { Router } from "express";
import {
  getPagos,
  getPagoById,
  createPago,
  updatePago,
  deletePago,
} from "../controllers/pago.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/", authRequired, getPagos);
router.get("/:id", authRequired, getPagoById);
router.post("/", authRequired, createPago);
router.put("/:id", authRequired, updatePago);
router.delete("/:id", authRequired, deletePago);

export default router;
