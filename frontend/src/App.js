import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await axios.get("http://localhost:5000/api/tasks");
        setTasks(response.data);
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        await axios.post("http://localhost:5000/api/tasks", { title: newTask });
        setNewTask("");
        fetchTasks();
    };

    const toggleComplete = async (task) => {
        await axios.put(`http://localhost:5000/api/tasks/${task.id}`, {
            ...task,
            completed: !task.completed,
        });
        fetchTasks();
    };

    const deleteTask = async (id) => {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`);
        fetchTasks();
    };

    const startEditing = (task) => {
        setEditingTask({ ...task });
    };

    const saveEdit = async () => {
        if (editingTask) {
            await axios.put(
                `http://localhost:5000/api/tasks/${editingTask.id}`,
                editingTask
            );
            setEditingTask(null);
            fetchTasks();
        }
    };

    return (
        <div className="App">
            <h1>Todo List</h1>

            <form onSubmit={addTask}>
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Thêm công việc mới"
                />
                <button type="submit">Thêm</button>
            </form>

            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        {editingTask && editingTask.id === task.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editingTask.title}
                                    onChange={(e) =>
                                        setEditingTask({
                                            ...editingTask,
                                            title: e.target.value,
                                        })
                                    }
                                />
                                <button onClick={saveEdit}>Lưu</button>
                            </>
                        ) : (
                            <>
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleComplete(task)}
                                />
                                <span
                                    style={{
                                        textDecoration: task.completed
                                            ? "line-through"
                                            : "none",
                                    }}
                                >
                                    {task.title}
                                </span>
                                <button onClick={() => startEditing(task)}>
                                    Sửa
                                </button>
                                <button onClick={() => deleteTask(task.id)}>
                                    Xóa
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
