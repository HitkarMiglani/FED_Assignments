const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = "secret123";

app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(__dirname, "users.json");
const TASKS_FILE = path.join(__dirname, "tasks.json");

async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeJsonFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

async function initializeDataFiles() {
  try {
    await readJsonFile(USERS_FILE);
  } catch {
    await writeJsonFile(USERS_FILE, []);
  }

  try {
    await readJsonFile(TASKS_FILE);
  } catch {
    await writeJsonFile(TASKS_FILE, []);
  }
}

// Routes

app.post("/api/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const users = await readJsonFile(USERS_FILE);

    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: uuidv4(),
      username,
      password: hashedPassword,
    };

    users.push(newUser);
    await writeJsonFile(USERS_FILE, users);

    res.status(201).json({
      message: "User created successfully",
      user: { id: newUser.id, username: newUser.username },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const users = await readJsonFile(USERS_FILE);
    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/tasks", authenticateToken, async (req, res) => {
  try {
    const tasks = await readJsonFile(TASKS_FILE);
    const userTasks = tasks.filter((task) => task.userId === req.user.id);
    res.json(userTasks);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/tasks", authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const tasks = await readJsonFile(TASKS_FILE);

    const newTask = {
      id: uuidv4(),
      userId: req.user.id,
      title,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    await writeJsonFile(TASKS_FILE, tasks);

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;

    const tasks = await readJsonFile(TASKS_FILE);
    const taskIndex = tasks.findIndex(
      (task) => task.id === id && task.userId === req.user.id
    );

    if (taskIndex === -1) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (title !== undefined) tasks[taskIndex].title = title;
    if (status !== undefined) tasks[taskIndex].status = status;
    tasks[taskIndex].updatedAt = new Date().toISOString();

    await writeJsonFile(TASKS_FILE, tasks);

    res.json(tasks[taskIndex]);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/tasks/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const tasks = await readJsonFile(TASKS_FILE);
    const filteredTasks = tasks.filter(
      (task) => !(task.id === id && task.userId === req.user.id)
    );

    if (tasks.length === filteredTasks.length) {
      return res.status(404).json({ error: "Task not found" });
    }

    await writeJsonFile(TASKS_FILE, filteredTasks);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/verify", authenticateToken, (req, res) => {
  res.json({
    message: "Token is valid",
    user: { id: req.user.id, username: req.user.username },
  });
});

async function startServer() {
  await initializeDataFiles();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
