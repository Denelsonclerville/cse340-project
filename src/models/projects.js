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

const saveProjectCategories = async (client, projectId, categoryIds) => {
  await client.query("DELETE FROM project_category WHERE project_id = $1;", [projectId]);
  for (const categoryId of categoryIds) {
    await client.query(
      "INSERT INTO project_category (project_id, category_id) VALUES ($1, $2);",
      [projectId, categoryId],
    );
  }
};

export const addProject = async ({ title, description, date, location, organizationId, categoryIds }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN;");
    const result = await client.query(
      `INSERT INTO project (organization_id, title, description, location, date)
       VALUES ($1, $2, $3, $4, $5) RETURNING project_id;`,
      [organizationId, title, description, location, date],
    );
    const projectId = result.rows[0].project_id;
    await saveProjectCategories(client, projectId, categoryIds);
    await client.query("COMMIT;");
    return projectId;
  } catch (error) {
    await client.query("ROLLBACK;");
    throw error;
  } finally {
    client.release();
  }
};

export const updateProject = async (id, { title, description, date, location, organizationId, categoryIds }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN;");
    await client.query(
      `UPDATE project
       SET organization_id = $1, title = $2, description = $3, location = $4, date = $5
       WHERE project_id = $6;`,
      [organizationId, title, description, location, date, id],
    );
    await saveProjectCategories(client, id, categoryIds);
    await client.query("COMMIT;");
  } catch (error) {
    await client.query("ROLLBACK;");
    throw error;
  } finally {
    client.release();
  }
};