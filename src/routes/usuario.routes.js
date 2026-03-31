import { Router } from "express";
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../controllers/usuario.controller.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", authRequired, requireRole(["admin"]), getUsuarios);
router.get("/:id", authRequired, requireRole(["admin"]), getUsuarioById);
router.post("/", authRequired, requireRole(["admin"]), createUsuario);
router.put("/:id", authRequired, requireRole(["admin"]), updateUsuario);
router.delete("/:id", authRequired, requireRole(["admin"]), deleteUsuario);

export default router;
