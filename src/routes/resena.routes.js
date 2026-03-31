import { Router } from "express";
import {
  getResenas,
  getResenaById,
  createResena,
  updateResena,
  deleteResena,
} from "../controllers/resena.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/", getResenas);
router.get("/:id", getResenaById);
router.post("/", authRequired, createResena);
router.put("/:id", authRequired, updateResena);
router.delete("/:id", authRequired, deleteResena);

export default router;
