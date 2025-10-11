const bcrypt = require("bcryptjs");
const { randomUUID } = require("node:crypto");
const { readUsers, writeUsers } = require("./storage");

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

class UserExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserExistsError";
    this.statusCode = 409;
  }
}

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthError";
    this.statusCode = 401;
  }
}

function sanitizeInput(value, field) {
  if (typeof value !== "string") {
    throw new ValidationError(`${field} must be a string`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new ValidationError(`${field} is required`);
  }
  return trimmed;
}

async function signup(name, password) {
  const safeName = sanitizeInput(name, "name");
  const safePassword = sanitizeInput(password, "password");
  if (safePassword.length < 6) {
    throw new ValidationError("password must be at least 6 characters long");
  }

  const users = await readUsers();
  const existing = users.find(
    (user) => user.name.toLowerCase() === safeName.toLowerCase()
  );
  if (existing) {
    throw new UserExistsError("name already registered");
  }

  const passwordHash = await bcrypt.hash(safePassword, 10);
  const newUser = {
    id: randomUUID(),
    name: safeName,
    passwordHash,
  };
  users.push(newUser);
  await writeUsers(users);
  return { id: newUser.id, name: newUser.name };
}

async function login(name, password) {
  const safeName = sanitizeInput(name, "name");
  const safePassword = sanitizeInput(password, "password");

  const users = await readUsers();
  const existing = users.find(
    (user) => user.name.toLowerCase() === safeName.toLowerCase()
  );
  if (!existing) {
    throw new AuthError("invalid credentials");
  }

  const match = await bcrypt.compare(safePassword, existing.passwordHash);
  if (!match) {
    throw new AuthError("invalid credentials");
  }

  return { id: existing.id, name: existing.name };
}

module.exports = {
  signup,
  login,
  ValidationError,
  UserExistsError,
  AuthError,
};
