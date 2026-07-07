import { Router } from "express";
import healthRoute from "../routes/health.route.js";
import authRoutes from "../routes/auth.routes.js";
import conversationRoutes from "../routes/conversation.route.js";
import aiRoutes from "../routes/ai.route.js";
import messageRoutes from "../routes/message.route.js";

const router = Router();

router.use('/health', healthRoute);
router.use('/auth', authRoutes);
router.use('/conversation', conversationRoutes);
router.use('/ai', aiRoutes);
router.use('/message', messageRoutes)

export default router;