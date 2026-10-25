import { Router, type IRouter } from "express";
import healthRouter from "./health";
import glowAiRouter from "./glowai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(glowAiRouter);

export default router;
