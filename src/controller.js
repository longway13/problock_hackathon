import pg from "pg";
import { pool } from "./db.js";

export const home = async (req, res) => {
  try {
    const query = "SELECT part, title, text FROM complaints";
    const result = await pool.query(query);

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving complaints");
  }
};

export const getAdd = (req, res) => {
  return res.send("예쁜 페이지");
};

export const postAdd = async (req, res) => {
  try {
    // const { title, text, part }  = req.body; // part 고민
    // const {user_id} = req.session; // 나중에
    const title = "공사장 직원분들이 너무 난폭해요";
    const text = "아 진짜 너무 화나네요, 이러다 진짜 화병 날 것 같아요";
    const part = "대인문제";
    const user_id = "2";
    const newComplaint = {
      part,
      status: "접수",
      title,
      text,
      released_time: JSON.stringify(new Date()).substring(1, 17),
      user_id,
    };

    const query = `INSERT INTO complaints (part, status, title, text, released_time, user_id) VALUES ($1, $2, $3, $4, $5, $6)`;
    const values = [
      newComplaint.part,
      newComplaint.status,
      newComplaint.title,
      newComplaint.text,
      newComplaint.released_time,
      newComplaint.user_id,
    ];

    await pool.query(query, values);
    console.log("Successfully added.");
    return res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding complaint");
  }
};

export const see = async (req, res) => {
  try {
    // const {id} = req.params;
    const id = 1;
    // id로 complain 정보 불러와야 하고
    const query = `SELECT part, title, text, total_pros, total_cons, views FROM complaints WHERE complaint_id = ${id} `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error showing complaint");
  }
};

export const add_views = async (req, res) => {
  try {
    // const {id} = req.params;
    // 현재 뷰 얻어오기.
    const id = 1;
    const getCurrentQuerry = `SELECT views FROM complaints WHERE complaint_id = ${id}`;
    const { rows } = await pool.query(getCurrentQuerry);
    const { views } = rows[0];
    // 새로운 뷰 DB에 변경.
    const newViews = views + 1;
    const query = `UPDATE complaints SET views = ${newViews} WHERE complaint_id = ${id}`;
    await pool.query(query);
    res.json(newViews);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error showing complaint");
  }
};
export const add_pros = async (req, res) => {
  try {
    // const {id} = req.params;
    const id = 1;
    const getCurrentQuerry = `SELECT total_pros FROM complaints WHERE complaint_id = ${id}`;
    const { rows } = await pool.query(getCurrentQuerry);
    const { total_pros } = rows[0];
    const new_pros = total_pros + 1;
    const query = `UPDATE complaints SET total_pros = ${new_pros} WHERE complaint_id = ${id}`;
    await pool.query(query);
    res.json(new_pros);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error showing complaint");
  }
};
export const add_cons = async (req, res) => {
  try {
    // const {id} = req.params;
    const id = 3;
    const getCurrentQuerry = `SELECT total_cons FROM complaints WHERE complaint_id = ${id}`;
    const { rows } = await pool.query(getCurrentQuerry);
    const { total_cons } = rows[0];
    const new_cons = total_cons + 1;
    const query = `UPDATE complaints SET total_cons = ${new_cons} WHERE complaint_id = ${id}`;
    await pool.query(query);
    res.json(new_cons);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error showing complaint");
  }
};

export const deleteComp = async (req, res) => {
  try {
    // const {id} = req.params;
    const id = 3;
    const query = `DELETE FROM complaints WHERE complaint_id = ${id}`;
    await pool.query(query);
    console.log("Delete completed");
    res.redirect("/");
  } catch (err) {
    res.status(500).json(err);
  }
};
export const watch_profile = async (req, res) => {
  try {
    // const user_id = req.session;
    const user_id = 2;

    const query = `SELECT sex, age, address, job, username FROM users WHERE user_id = ${user_id}`;
    const result = await pool.query(query);
    return res.json(result.rows);
  } catch (err) {
    return res.send(err);
  }
};
export const edit = async (req, res) => {
  return res.send("예쁜 페이지 보여주세용");
};
export const post_edit = async (req, res) => {
  try {
    // const {username, sex, address, job, age } = req.body;
    // const {user_id} = req.session;
    const new_profile = {
      username: "태원",
      sex: "M",
      address: "팔달동",
      job: "투자자",
      age: "39",
    };
    const user_id = 2;

    const query =
      "UPDATE users SET username = $1, sex = $2, address = $3, job = $4, age=$5";
    const value = [
      new_profile.username,
      new_profile.sex,
      new_profile.address,
      new_profile.job,
      new_profile.age,
    ];

    await pool.query(query, value);

    res.redirect("/profile");
  } catch (err) {
    return res.send(err);
  }
};
