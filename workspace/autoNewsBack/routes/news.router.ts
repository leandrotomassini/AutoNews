import { Router, Request, Response } from "express";

import { getTnNews } from "../controller/news.controller";

const router = Router();

router.get("/tn", getTnNews);

export default router;
