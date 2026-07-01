import { Router, type IRouter } from "express";
import healthRouter from "./health";
import botRouter from "./bot";
import commandsRouter from "./commands";

const router: IRouter = Router();

router.use(healthRouter);
router.use(botRouter);
router.use(commandsRouter);

export default router;
