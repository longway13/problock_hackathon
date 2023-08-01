import pg from "pg";
import { pool } from "./db.js";
import { Log } from "./contract.js";
export const home = async (req, res) => {
  try {

    // const query = `SELECT part, title, text FROM complaints`;
    const query_popular = `SELECT complaints.*, users.username, users.profile FROM complaints LEFT JOIN users ON complaints.user_id = users.user_id ORDER BY views DESC LIMIT 2`;
    const query_recent = `SELECT complaints.*, users.username, users.profile FROM complaints LEFT JOIN users ON complaints.user_id = users.user_id ORDER BY released_time DESC LIMIT 2`;

    const result_popular = await pool.query(query_popular);
    console.log("Popular complaints uploaded ✅");
    const result_recent = await pool.query(query_recent);
    console.log("Protected complaints uploaded ✅");
    res.json({ popular: result_popular.rows, protected: result_recent.rows });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
export const popular = async (req, res) => {
  try {
    const { size, page } = req.query;
    // const query = `SELECT part, title, text FROM complaints`;
    const query = `SELECT complaints.*, users.username, users.profile FROM complaints LEFT JOIN users ON complaints.user_id = users.user_id ORDER BY views LIMIT ${size} OFFSET ${(page - 1) * size}`;

    const { rows } = await pool.query(query);
    console.log("All complaints uploaded ✅");
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}
export const protect = async (req, res) => {
  try {
    const { size, page } = req.query;
    // const query = `SELECT part, title, text FROM complaints`;
    const query = `SELECT complaints.*, users.username, users.profile FROM complaints LEFT JOIN users ON complaints.user_id = users.user_id ORDER BY released_time DESC LIMIT ${size} OFFSET ${(page - 1) * size}`;
    const { rows } = await pool.query(query);
    console.log("All complaints uploaded ✅");
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

export const getAdd = (req, res) => {
  return res.send("예쁜 페이지");
};

export const postAdd = async (req, res) => {
  try {
    const { title, text, part } = req.body; // part 고민
    const { user_id } = req.query;
    // const {user_id} = req.session; // 나중에
    const newComplaint = {
      part,
      status: "접수",
      title,
      text,
      released_time: JSON.stringify(new Date()).substring(1, 17),
      user_id,
    };

    const query = `INSERT INTO complaints (part, status, title, text, released_time, user_id) VALUES ($1, $2, $3, $4, $5, $6) returning complaint_id, released_time`;
    const values = [
      newComplaint.part,
      newComplaint.status,
      newComplaint.title,
      newComplaint.text,
      newComplaint.released_time,
      newComplaint.user_id,
    ];
    const { rows } = await pool.query(query, values);
    console.log("Successfully added.✅");


    await Log(user_id,
      rows[0].complaint_id,
      "P",
      JSON.stringify(rows[0].released_time));
    console.log("안될거니?");
    return res.end();
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding complaint");
  }
};

export const see = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.query;
    // const id = 1;
    // id로 complain 정보 불러와야 하고
    const query = `SELECT complaints.* , users.username, users.profile FROM complaints LEFT JOIN users ON complaints.user_id = users.user_id WHERE complaints.complaint_id = ${id} `;
    const result_complaints = await pool.query(query);

    const query_vote = `SELECT position FROM vote  WHERE vote.user_id = ${user_id} AND vote.complaint_id = ${id} `;
    const result_votes = await pool.query(query_vote);

    const vote_result = result_votes.rows.length > 0 ? result_votes.rows[0].position : "0";

    const voted = result_votes.rows.length > 0 ? "T" : "F";
    res.json({
      complaint: result_complaints.rows,
      vote: voted,
      position: vote_result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const add_views = async (req, res) => {
  try {
    const { id } = req.params;
    // 현재 뷰 얻어오기.
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
    const { id } = req.params;
    const { user_id } = req.query;
    console.log(id);
    // const complaint_id = 1;
    const getCurrentQuerry = `SELECT total_pros FROM complaints WHERE complaint_id = ${id}`;
    const { rows } = await pool.query(getCurrentQuerry);
    console.log("Succesfully Selected✅");
    const { total_pros } = rows[0];
    const new_pros = total_pros + 1;
    const query = `UPDATE complaints SET total_pros = ${new_pros} WHERE complaint_id = ${id}`;
    await pool.query(query);
    await Log(parseInt(user_id),
      parseInt(id),
      "G",
      JSON.stringify(rows[0].released_time));


    //vote
    const query_vote = `INSERT INTO vote (complaint_id, user_id, position) VALUES($1, $2,$3)`;
    const values_vote = [id, user_id, "G"];
    await pool.query(query_vote, values_vote);
    return res.json(new_pros);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error showing complaint");
  }
};
export const add_cons = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.query;
    console.log(id, user_id);
    const getCurrentQuerry = `SELECT total_cons FROM complaints WHERE complaint_id = ${id}`;
    const { rows } = await pool.query(getCurrentQuerry);
    console.log("Succesfully Selected✅");
    const { total_cons } = rows[0];
    const new_cons = total_cons + 1;
    const query = `UPDATE complaints SET total_cons = ${new_cons} WHERE complaint_id = ${id}`;
    await pool.query(query);
    // log
    await Log(parseInt(user_id),
      parseInt(id),
      "B",
      JSON.stringify(rows[0].released_time));
    const query_vote = `INSERT INTO vote (complaint_id, user_id, position) VALUES($1, $2,$3)`;
    const values_vote = [id, user_id, "B"];
    await pool.query(query_vote, values_vote);
    return res.json(new_cons);


    //vote

  } catch (err) {
    console.log(err);
    return res.status(500).send("Error showing complaint");
  }
};

export const deleteComp = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.query;
    const query = `DELETE FROM complaints WHERE complaint_id = ${id}`;
    await pool.query(query);
    console.log("Delete completed");
    // log
    await Log(user_id,
      id,
      "D",
      JSON.stringify(rows[0].released_time));
    res.redirect("/");
  } catch (err) {
    res.status(500).json(err);
  }
}



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
