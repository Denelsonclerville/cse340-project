import {
  addVolunteer,
  addProject,
  getProjectDetails,
  getProjectsByCategoryId,
  getUpcomingProjects,
  isUserVolunteering,
  removeVolunteer,
  updateProject,
} from "../models/projects.js";
import { getAllCategories, getCategoriesByProjectId } from "../models/categories.js";
import { getAllOrganizations } from "../models/organizations.js";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const getProjectFormData = (body = {}) => ({
  title: String(body.title ?? "").trim(),
  description: String(body.description ?? "").trim(),
  date: String(body.date ?? "").trim(),
  location: String(body.location ?? "").trim(),
  organization_id: String(body.organization_id ?? ""),
  category_ids: (Array.isArray(body.category_ids) ? body.category_ids : [body.category_ids])
    .filter(Boolean)
    .map(String),
});

const getProjectFormDataError = (formData, organizations, categories) => {
  if (!formData.title || formData.title.length > 150) return "Title is required and must be 150 characters or fewer.";
  if (!formData.description) return "Description is required.";
  if (!formData.date || formData.date.length > 100) return "Date is required and must be 100 characters or fewer.";
  if (!formData.location || formData.location.length > 255) return "Location is required and must be 255 characters or fewer.";
  if (!organizations.some((organization) => String(organization.organization_id) === formData.organization_id)) {
    return "Choose an organization.";
  }
  if (!formData.category_ids.length) return "Choose at least one category.";
  if (formData.category_ids.some((id) => !categories.some((category) => String(category.category_id) === id))) {
    return "Choose valid categories.";
  }
  return null;
};

const renderProjectForm = async (res, { title, action, formData, error = null, status = 200 }) => {
  const [organizations, categories] = await Promise.all([getAllOrganizations(), getAllCategories()]);
  res.status(status).render("project-form", { title, action, formData, error, organizations, categories });
};

export const showProjectsPage = async (req, res, next) => {
  try {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    res.render("projects", { title: "Upcoming Service Projects", projects });
  } catch (error) {
    next(error);
  }
};

export const showProjectDetailsPage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [project, categories] = await Promise.all([
      getProjectDetails(id),
      getCategoriesByProjectId(id),
    ]);

    if (!project) {
      return res.status(404).send("Project not found");
    }

    const isVolunteering = req.session.user
      ? await isUserVolunteering(req.session.user.id, id)
      : false;
    res.render("project", { title: project.title, project, categories, isVolunteering });
  } catch (error) {
    next(error);
  }
};

export const processVolunteerSignup = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    if (!project) {
      return res.status(404).send("Project not found");
    }

    await addVolunteer(req.session.user.id, projectId);
    req.session.notice = "You are now volunteering for this project.";
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
};

export const processVolunteerRemoval = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    if (!project) {
      return res.status(404).send("Project not found");
    }

    await removeVolunteer(req.session.user.id, projectId);
    req.session.notice = "You are no longer volunteering for this project.";
    res.redirect(
      req.body?.returnTo === "dashboard" ? "/dashboard" : `/project/${projectId}`,
    );
  } catch (error) {
    next(error);
  }
};

export const showAddProjectPage = async (req, res, next) => {
  try {
    await renderProjectForm(res, {
      title: "Add Project",
      action: "/new-project",
      formData: { title: "", description: "", date: "", location: "", organization_id: "", category_ids: [] },
    });
  } catch (error) {
    next(error);
  }
};

export const processAddProject = async (req, res, next) => {
  const formData = getProjectFormData(req.body);
  try {
    const [organizations, categories] = await Promise.all([getAllOrganizations(), getAllCategories()]);
    const error = getProjectFormDataError(formData, organizations, categories);
    if (error) {
      return await renderProjectForm(res, { title: "Add Project", action: "/new-project", formData, error, status: 400 });
    }
    await addProject({
      title: formData.title,
      description: formData.description,
      date: formData.date,
      location: formData.location,
      organizationId: formData.organization_id,
      categoryIds: formData.category_ids,
    });
    res.redirect("/projects");
  } catch (error) {
    next(error);
  }
};

export const showEditProjectPage = async (req, res, next) => {
  try {
    const [project, categories] = await Promise.all([
      getProjectDetails(req.params.id),
      getCategoriesByProjectId(req.params.id),
    ]);
    if (!project) return res.status(404).send("Project not found");
    await renderProjectForm(res, {
      title: "Edit Project",
      action: `/edit-project/${project.project_id}`,
      formData: {
        ...project,
        organization_id: String(project.organization_id),
        category_ids: categories.map(({ category_id }) => String(category_id)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const processEditProject = async (req, res, next) => {
  const formData = getProjectFormData(req.body);
  try {
    const project = await getProjectDetails(req.params.id);
    if (!project) return res.status(404).send("Project not found");
    const [organizations, categories] = await Promise.all([getAllOrganizations(), getAllCategories()]);
    const error = getProjectFormDataError(formData, organizations, categories);
    if (error) {
      return await renderProjectForm(res, {
        title: "Edit Project", action: `/edit-project/${req.params.id}`, formData, error, status: 400,
      });
    }
    await updateProject(req.params.id, {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      location: formData.location,
      organizationId: formData.organization_id,
      categoryIds: formData.category_ids,
    });
    res.redirect(`/project/${req.params.id}`);
  } catch (error) {
    next(error);
  }
};