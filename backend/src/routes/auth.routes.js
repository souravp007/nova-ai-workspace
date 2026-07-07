import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import * as ctrl from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/register', validate(registerSchema), ctrl.register);
router.post('/login', validate(loginSchema), ctrl.login);
router.post("/refresh-token", ctrl.refreshAccessToken);
router.post("/logout", authMiddleware, ctrl.logout);
router.get("/me", authMiddleware, ctrl.getCurrentUser);

export default router;
