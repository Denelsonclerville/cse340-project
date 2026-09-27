import pool from "../config/db.js";

export const getHomePageData = async () => {
  const [countResult, featuredResult] = await Promise.all([
    pool.query("SELECT COUNT(*)::integer AS count FROM project;"),
    pool.query(`
      SELECT
        project.project_id,
        project.title AS name,
        COALESCE(category.name, 'Community Service') AS category,
        project.location,
        organization.name AS organization_name
      FROM project
      JOIN organization ON organization.organization_id = project.organization_id
      LEFT JOIN LATERAL (
        SELECT category.name
        FROM project_category
        JOIN category ON category.category_id = project_category.category_id
        WHERE project_category.project_id = project.project_id
        ORDER BY category.name
        LIMIT 1
      ) AS category ON true
      ORDER BY project.project_id ASC
      LIMIT 3;
    `),
  ]);

  return {
    projectCount: countResult.rows[0].count,
    featuredProjects: featuredResult.rows,
  };
};

export const getUpcomingProjects = async (number_of_projects) => {
  const query = `
    SELECT
      project.project_id,
      project.title,
      project.description,
      project.date,
      project.location,
      project.organization_id,
      organization.name AS organization_name
    FROM project
    JOIN organization ON organization.organization_id = project.organization_id
    ORDER BY project.project_id ASC
    LIMIT $1;
  `;
  const result = await pool.query(query, [number_of_projects]);
  return result.rows;
};

export const getProjectDetails = async (id) => {
  const query = `
    SELECT
      project.project_id,
      project.title,
      project.description,
      project.date,
      project.location,
      project.organization_id,
      organization.name AS organization_name
    FROM project
    JOIN organization ON organization.organization_id = project.organization_id
    WHERE project.project_id = $1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const getProjectsByCategoryId = async (categoryId) => {
  const query = `
    SELECT
      project.project_id,
      project.title,
      project.description,
      project.date,
      project.location,
      project.organization_id,
      organization.name AS organization_name
    FROM project
    JOIN project_category ON project_category.project_id = project.project_id
    JOIN organization ON organization.organization_id = project.organization_id
    WHERE project_category.category_id = $1
    ORDER BY project.project_id ASC;
  `;
  const result = await pool.query(query, [categoryId]);
  return result.rows;
};