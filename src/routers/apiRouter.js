import express from "express";
import { add_views, add_pros, add_cons } from "../controller.js";

const apiRouter = express.Router();

apiRouter.post("/:id/views", add_views);
apiRouter.post("/:id/total_pros", add_pros);
apiRouter.post("/:id/total_cons", add_cons);

export default apiRouter;
