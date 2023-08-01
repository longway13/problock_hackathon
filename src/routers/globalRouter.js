import express from "express";
import { home, getAdd, postAdd, see, deleteComp, protect, popular } from "../controller.js";
const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/popular", popular );
globalRouter.get("/protected", protect );
globalRouter.get("/add", getAdd);
globalRouter.post("/add", postAdd);
globalRouter.get("/:id(\\d+)", see);
globalRouter.delete("/:id(\\d+)", deleteComp);
export default globalRouter;
