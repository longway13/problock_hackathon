


const recent = async (req, res) => {
    try {
        const { size, page } = req.query;
    
        // const query = `SELECT part, title, text FROM complaints`;
        const query = `SELECT complaints.*, users.username, users.profile FROM complaints LEFT JOIN users ON complaints.user_id = users.user_id ORDER BY released_time DESC LIMIT ${size} OFFSET ${(page - 1) * size}`;
    
        const {rows} = await pool.query(query);
        console.log("All complaints uploaded ✅");
        res.json(rows);
    
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
}