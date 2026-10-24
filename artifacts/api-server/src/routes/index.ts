import { Router, type IRouter } from "express";
import healthRouter from "./health";
<<<<<<< HEAD
import glowAiRouter from "./glowai";
=======
>>>>>>> fa3ed5c (Initial commit)

const router: IRouter = Router();

router.use(healthRouter);
<<<<<<< HEAD
router.use(glowAiRouter);
=======
>>>>>>> fa3ed5c (Initial commit)

export default router;
