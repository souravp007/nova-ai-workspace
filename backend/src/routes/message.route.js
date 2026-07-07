import { Router } from "express";
import * as ctrl from "../controllers/message.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getConversationIdSchema } from "../validators/conversation.validator.js";

const router = Router();

router.use(authMiddleware);

router.get("/:id/chat", validate(getConversationIdSchema), ctrl.getMessages);

export default router;