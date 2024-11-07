const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Kết nối MySQL
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "todolist_db",
});

// API endpoints
// Lấy tất cả công việc
app.get("/api/tasks", (req, res) => {
    connection.query("SELECT * FROM tasks", (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Thêm công việc mới
app.post("/api/tasks", (req, res) => {
    const { title } = req.body;
    connection.query(
        "INSERT INTO tasks (title) VALUES (?)",
        [title],
        (error, results) => {
            if (error) throw error;
            res.json({ id: results.insertId, title, completed: false });
        }
    );
});

// Cập nhật trạng thái công việc
app.put("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    connection.query(
        "UPDATE tasks SET title = ?, completed = ? WHERE id = ?",
        [title, completed, id],
        (error) => {
            if (error) throw error;
            res.json({ id, title, completed });
        }
    );
});

// Xóa công việc
app.delete("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    connection.query("DELETE FROM tasks WHERE id = ?", [id], (error) => {
        if (error) throw error;
        res.json({ message: "Đã xóa thành công" });
    });
});

app.listen(5000, () => {
    console.log("Server đang chạy tại port 5000");
});
