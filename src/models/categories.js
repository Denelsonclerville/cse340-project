import pool from "../config/db.js";

export const getAllCategories = async () => {
  const query = `
    SELECT category_id, name
    FROM category
    ORDER BY name;
  `;
  const result = await pool.query(query);

  return result.rows;
};
