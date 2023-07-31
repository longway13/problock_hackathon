import express from "express";
import { home, getAdd, postAdd, see, deleteComp, recent, popular } from "../controller.js";
const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/popular", popular );
globalRouter.get("/recent", recent );
globalRouter.get("/add", getAdd);
globalRouter.post("/add", postAdd);
globalRouter.get("/:id(\\d+)", see);
globalRouter.delete("/:id(\\d+)", deleteComp);
export default globalRouter;
