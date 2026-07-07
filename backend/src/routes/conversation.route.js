import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import * as ctrl from "../controllers/conversation.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { getConversationIdSchema, renameConversationSchema } from "../validators/conversation.validator.js";


const router = Router();

router.use(authMiddleware);

// router.post("/", ctrl.createConversation);
router.get("/", ctrl.getAllConversations);
router.get("/:id", validate(getConversationIdSchema), ctrl.getConversationById);
router.delete("/:id", validate(renameConversationSchema), ctrl.renameConversation);
router.patch("/:id/pin", validate(getConversationIdSchema), ctrl.togglePinConversation);
router.delete("/:id", validate(getConversationIdSchema), ctrl.deleteConversation);

export default router;