import express from "express";
import { pool, connection } from "./db.js";
import cors from "cors";
import morgan from "morgan";
import pg from "pg";
import dotenv from "dotenv";
import globalRouter from "./routers/globalRouter.js";
import apiRouter from "./routers/apiRouter.js";
import userRouter from "./routers/userRouter.js";
//설정

//express 사용
const app = express();
const logger = morgan("dev");
app.use(logger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", globalRouter);
app.use("/api", apiRouter);
app.use("/profile", userRouter);
// http listen port 생성 서버 실행
connection();
app.listen(4000, () => console.log("Server is listening on PORT 4000✅"));
