const express = require("express");
const cors = require("cors");
const {
  signup,
  login,
  ValidationError,
  UserExistsError,
  AuthError,
} = require("./authService");

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to the Academy Gatekeeper API",
    endpoints: {
      signup: {
        method: "POST",
        path: "/signup",
      },
      login: {
        method: "POST",
        path: "/login",
      },
    },
  });
});

app.post("/signup", async (req, res) => {
  try {
    const { name, password } = req.body ?? {};
    const user = await signup(name, password);
    res.status(201).json({
      message: "Signup successful",
      user,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body ?? {};
    const user = await login(name, password);
    res.json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    handleError(res, error);
  }
});

function handleError(res, error) {
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  if (error instanceof UserExistsError) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  if (error instanceof AuthError) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  console.error("Unexpected error", error);
  return res.status(500).json({ error: "Internal server error" });
}

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Gatekeeper API listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
