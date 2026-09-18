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