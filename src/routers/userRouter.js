import express from "express";
import { watch_profile, edit, post_edit } from "../controller.js";
const userRouter = express.Router();

userRouter.get("/", watch_profile);
userRouter.get("/edit", edit);
userRouter.post("/edit", post_edit);

export default userRouter;
