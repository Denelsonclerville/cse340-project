import {
  addOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
} from "../models/organizations.js";

const organizationLogos = ["brightfuture-logo.png", "greenharvest-logo.png", "unityserve-logo.png"];

const getOrganizationFormData = (body = {}) => ({
  name: String(body.name ?? "").trim(),
  description: String(body.description ?? "").trim(),
  contact_email: String(body.contact_email ?? "").trim(),
  logo_filename: String(body.logo_filename ?? "").trim(),
});

const validateOrganization = (formData) => {
  if (!formData.name || formData.name.length > 150) return "Name is required and must be 150 characters or fewer.";
  if (!formData.description) return "Description is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) return "Enter a valid contact email.";
  if (!organizationLogos.includes(formData.logo_filename)) return "Choose an organization logo.";
  return null;
};

const renderOrganizationForm = (res, { title, action, formData, error = null, status = 200 }) => {
  res.status(status).render("organization-form", { title, action, formData, error, organizationLogos });
};

export const showOrganizationsPage = async (req, res, next) => {
  try {
    const organizations = await getAllOrganizations();
    res.render("organizations", { title: "Organizations", organizations });
  } catch (error) {
    next(error);
  }
};

export const showOrganizationDetailsPage = async (req, res, next) => {
  try {
    const organization = await getOrganizationById(req.params.id);

    if (!organization) {
      return res.status(404).send("Organization not found");
    }

    res.render("organizations", {
      title: organization.name,
      organizations: [organization],
    });
  } catch (error) {
    next(error);
  }
};

export const showAddOrganizationPage = (req, res) => {
  renderOrganizationForm(res, {
    title: "Add Organization",
    action: "/new-organization",
    formData: { name: "", description: "", contact_email: "", logo_filename: "" },
  });
};

export const processAddOrganization = async (req, res, next) => {
  const formData = getOrganizationFormData(req.body);
  const error = validateOrganization(formData);
  if (error) {
    return renderOrganizationForm(res, {
      title: "Add Organization", action: "/new-organization", formData, error, status: 400,
    });
  }

  try {
    await addOrganization({
      name: formData.name,
      description: formData.description,
      contactEmail: formData.contact_email,
      logoFilename: formData.logo_filename,
    });
    res.redirect("/organizations");
  } catch (error) {
    if (error.code === "23505") {
      return renderOrganizationForm(res, {
        title: "Add Organization", action: "/new-organization", formData,
        error: "An organization with that name already exists.", status: 400,
      });
    }
    next(error);
  }
};

export const showEditOrganizationPage = async (req, res, next) => {
  try {
    const organization = await getOrganizationById(req.params.id);
    if (!organization) return res.status(404).send("Organization not found");
    renderOrganizationForm(res, {
      title: "Edit Organization",
      action: `/edit-organization/${organization.organization_id}`,
      formData: organization,
    });
  } catch (error) {
    next(error);
  }
};

export const processEditOrganization = async (req, res, next) => {
  const formData = getOrganizationFormData(req.body);
  const error = validateOrganization(formData);
  if (error) {
    return renderOrganizationForm(res, {
      title: "Edit Organization", action: `/edit-organization/${req.params.id}`,
      formData, error, status: 400,
    });
  }

  try {
    const organization = await getOrganizationById(req.params.id);
    if (!organization) return res.status(404).send("Organization not found");
    await updateOrganization(req.params.id, {
      name: formData.name,
      description: formData.description,
      contactEmail: formData.contact_email,
      logoFilename: formData.logo_filename,
    });
    res.redirect("/organizations");
  } catch (error) {
    if (error.code === "23505") {
      return renderOrganizationForm(res, {
        title: "Edit Organization", action: `/edit-organization/${req.params.id}`,
        formData, error: "An organization with that name already exists.", status: 400,
      });
    }
    next(error);
  }
};