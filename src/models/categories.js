import pool from "../config/db.js";

export const getAllCategories = async () => {
  const query = "SELECT category_id, name FROM category ORDER BY name;";
  const result = await pool.query(query);
  return result.rows;
};

export const getCategoryById = async (id) => {
  const query = "SELECT category_id, name FROM category WHERE category_id = $1;";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const getCategoriesByProjectId = async (projectId) => {
  const query = `
    SELECT category.category_id, category.name
    FROM category
    JOIN project_category ON project_category.category_id = category.category_id
    WHERE project_category.project_id = $1
    ORDER BY category.name;
  `;
  const result = await pool.query(query, [projectId]);
  return result.rows;
};
