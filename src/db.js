import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const config = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT,
  max: 10,
};

export const pool = new pg.Pool(config);

export const connection = async (req, res, next) => {
  try {
    const client = await pool.connect();
    client.release();
    console.log("PostgreSQL Connected✅");
    return;
  } catch (err) {
    console.error("PostgreSQL 연결 확인: 실패", err);
    return;
  }
};
