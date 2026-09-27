import {
  getAllOrganizations,
  getOrganizationById,
} from "../models/organizations.js";

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