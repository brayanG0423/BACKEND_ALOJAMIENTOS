import { Router } from "express";
import {
  getImagenes,
  createImagen,
  deleteImagen,
} from "../controllers/imagen.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/", getImagenes);
router.post("/", authRequired, createImagen);
router.delete("/:id", authRequired, deleteImagen);

export default router;
