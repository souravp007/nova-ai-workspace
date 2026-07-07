import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { chatSchema } from "../validators/ai.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import * as ctrl from "../controllers/ai.controller.js";
import upload from "../middlewares/multer.middleware.js";


const router = Router();

router.post("/chat", authMiddleware, upload.array("files", 5), validate(chatSchema), ctrl.sendMessage);
router.post("/chat/stream", authMiddleware, upload.array("files", 5), validate(chatSchema), ctrl.streamMessage);

export default router;