import pool from "../config/db.js";

export const getAllProjects = async () => {
  try {
    const query = `
      SELECT
        project.project_id,
        project.organization_id,
        project.title,
        project.title AS name,
        project.description,
        project.location,
        project.date,
        organization.name AS organization_name,
        STRING_AGG(category.name, ', ' ORDER BY category.name) AS category_names,
        MIN(category.name) AS category
      FROM project
      JOIN organization ON organization.organization_id = project.organization_id
      JOIN project_category ON project_category.project_id = project.project_id
      JOIN category ON category.category_id = project_category.category_id
      GROUP BY project.project_id, organization.name
      ORDER BY project.project_id;
    `;
    const result = await pool.query(query);

    return result.rows;
  } catch (err) {
    console.error("Database error in getProjects:", err);
    throw err;
  }
};