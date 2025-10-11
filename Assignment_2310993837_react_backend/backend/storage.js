const fs = require("node:fs/promises");
const path = require("node:path");

const DATA_FILE = path.join(__dirname, "users.json");

async function ensureFile() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(DATA_FILE, "[]", "utf8");
    } else {
      throw error;
    }
  }
}

async function readUsers() {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  if (!raw.trim()) {
    return [];
  }
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) {
    throw new Error("users.json must contain an array");
  }
  return data;
}

async function writeUsers(users) {
  if (!Array.isArray(users)) {
    throw new TypeError("writeUsers expects an array");
  }
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), "utf8");
}

module.exports = {
  readUsers,
  writeUsers,
  DATA_FILE,
};
