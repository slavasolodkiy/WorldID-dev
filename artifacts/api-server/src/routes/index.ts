import { Router, type IRouter } from "express";
import healthRouter from "./health";
import docsRouter from "./docs";
import changelogRouter from "./changelog";
import sdksRouter from "./sdks";
import contactRouter from "./contact";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/docs", docsRouter);
router.use("/changelog", changelogRouter);
router.use("/sdks", sdksRouter);
router.use("/contact", contactRouter);
router.use("/stats", statsRouter);

export default router;
