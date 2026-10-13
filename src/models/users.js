import bcrypt from "bcryptjs";
import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT user_id, name, email, password_hash, role FROM users WHERE email = $1;",
    [email],
  );
  return result.rows[0] || null;
};

export const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT user_id, name, email, role FROM users WHERE user_id = $1;",
    [id],
  );
  return result.rows[0] || null;
};

export const validatePassword = (password, passwordHash) =>
  bcrypt.compare(password, passwordHash);

export const createUser = async ({ name, email, password }) => {
  const passwordHash = await bcrypt.hash(password, 12);
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'user')
     RETURNING user_id, name, email, role;`,
    [name, email, passwordHash],
  );
  return result.rows[0];
};

export const getAllUsers = async () => {
  const result = await pool.query(
    "SELECT user_id, name, email, role FROM users ORDER BY name, email;",
  );
  return result.rows;
};
