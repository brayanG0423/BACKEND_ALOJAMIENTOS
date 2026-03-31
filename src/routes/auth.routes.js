import { Router } from "express";
import { login, register, me } from "../controllers/auth.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", authRequired, me);

export default router;
