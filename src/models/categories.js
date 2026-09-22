import pool from "../config/db.js";

export const getAllCategories = async () => {
  try {
    const query = `
      SELECT category_id, name
      FROM category
      ORDER BY name;
    `;
    const result = await pool.query(query);

    return result.rows;
  } catch (err) {
    console.error("Database error in getCategories:", err);
    throw err;
  }
};
