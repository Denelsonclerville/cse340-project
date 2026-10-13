import pool from "../config/db.js";

export const getAllOrganizations = async () => {
  const query = `
    SELECT
      organization.organization_id,
      organization.name,
      organization.description,
      organization.description AS focus,
      organization.contact_email,
      organization.logo_filename,
      '/images/' || organization.logo_filename AS image,
      COUNT(project.project_id)::integer AS projects
    FROM organization
    LEFT JOIN project ON project.organization_id = organization.organization_id
    GROUP BY organization.organization_id
    ORDER BY organization.name;
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const getOrganizationById = async (id) => {
  const query = `
    SELECT
      organization.organization_id,
      organization.name,
      organization.description,
      organization.description AS focus,
      organization.contact_email,
      organization.logo_filename,
      '/images/' || organization.logo_filename AS image,
      COUNT(project.project_id)::integer AS projects
    FROM organization
    LEFT JOIN project ON project.organization_id = organization.organization_id
    WHERE organization.organization_id = $1
    GROUP BY organization.organization_id;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const addOrganization = async ({ name, description, contactEmail, logoFilename }) => {
  const query = `
    INSERT INTO organization (name, description, contact_email, logo_filename)
    VALUES ($1, $2, $3, $4)
    RETURNING organization_id;
  `;
  const result = await pool.query(query, [name, description, contactEmail, logoFilename]);
  return result.rows[0];
};

export const updateOrganization = async (id, { name, description, contactEmail, logoFilename }) => {
  const query = `
    UPDATE organization
    SET name = $1, description = $2, contact_email = $3, logo_filename = $4
    WHERE organization_id = $5
    RETURNING organization_id;
  `;
  const result = await pool.query(query, [name, description, contactEmail, logoFilename, id]);
  return result.rows[0];
};