import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { chatSchema } from "../validators/ai.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import * as ctrl from "../controllers/ai.controller.js";


const router = Router();

router.post("/chat", authMiddleware, validate(chatSchema), ctrl.sendMessage);
router.post("/chat/stream", authMiddleware, validate(chatSchema), ctrl.streamMessage);
export default router;