import {
  addVolunteer,
  addProject,
  getProjectDetails,
  getProjectsByCategoryId,
  getAllProjects,
  isUserVolunteering,
  removeVolunteer,
  updateProject,
  updateProjectCategories,
} from "../models/projects.js";
import { getAllCategories, getCategoriesByProjectId } from "../models/categories.js";
import { getAllOrganizations } from "../models/organizations.js";
import { consumeFormDraft, redirectWithFormError } from "./flash.js";

const getProjectFormData = (body = {}) => ({
  title: String(body.title ?? "").trim(),
  description: String(body.description ?? "").trim(),
  date: String(body.date ?? "").trim(),
  location: String(body.location ?? "").trim(),
  organization_id: String(body.organization_id ?? ""),
});

const getProjectFormDataError = (formData, organizations) => {
  if (!formData.title || formData.title.length > 150) return "Title is required and must be 150 characters or fewer.";
  if (!formData.description) return "Description is required.";
  if (!formData.date || formData.date.length > 100) return "Date is required and must be 100 characters or fewer.";
  if (!formData.location || formData.location.length > 255) return "Location is required and must be 255 characters or fewer.";
  if (!organizations.some((organization) => String(organization.organization_id) === formData.organization_id)) {
    return "Choose an organization.";
  }
  return null;
};

const renderProjectForm = async (res, { title, action, formData }) => {
  const organizations = await getAllOrganizations();
  res.render("project-form", { title, action, formData, organizations });
};

export const showProjectsPage = async (req, res, next) => {
  try {
    const projects = await getAllProjects();
    res.render("projects", { title: "Service Projects", projects });
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
      formData: consumeFormDraft(req, "newProjectFormData", {
        title: "", description: "", date: "", location: "", organization_id: "",
      }),
    });
  } catch (error) {
    next(error);
  }
};

export const processAddProject = async (req, res, next) => {
  const formData = getProjectFormData(req.body);
  try {
    const organizations = await getAllOrganizations();
    const error = getProjectFormDataError(formData, organizations);
    if (error) {
      return redirectWithFormError(req, res, {
        path: "/new-project", key: "newProjectFormData", formData, message: error,
      });
    }
    await addProject({
      title: formData.title,
      description: formData.description,
      date: formData.date,
      location: formData.location,
      organizationId: formData.organization_id,
    });
    req.session.notice = "Project created successfully.";
    res.redirect("/projects");
  } catch (error) {
    next(error);
  }
};

export const showEditProjectPage = async (req, res, next) => {
  try {
    const project = await getProjectDetails(req.params.id);
    if (!project) return res.status(404).send("Project not found");
    await renderProjectForm(res, {
      title: "Edit Project",
      action: `/edit-project/${project.project_id}`,
      formData: consumeFormDraft(req, `editProjectFormData:${project.project_id}`, {
        ...project,
        organization_id: String(project.organization_id),
      }),
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
    const organizations = await getAllOrganizations();
    const error = getProjectFormDataError(formData, organizations);
    if (error) {
      return redirectWithFormError(req, res, {
        path: `/edit-project/${req.params.id}`,
        key: `editProjectFormData:${req.params.id}`,
        formData,
        message: error,
      });
    }
    await updateProject(req.params.id, {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      location: formData.location,
      organizationId: formData.organization_id,
    });
    req.session.notice = "Project updated successfully.";
    res.redirect(`/project/${req.params.id}`);
  } catch (error) {
    next(error);
  }
};

export const showProjectCategoriesPage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [project, categories, assignedCategories] = await Promise.all([
      getProjectDetails(id),
      getAllCategories(),
      getCategoriesByProjectId(id),
    ]);
    if (!project) return res.status(404).send("Project not found");

    const formKey = `projectCategoryIds:${id}`;
    const selectedCategoryIds = consumeFormDraft(
      req,
      formKey,
      assignedCategories.map(({ category_id }) => String(category_id)),
    );
    res.render("project-categories-form", {
      title: "Assign Categories",
      project,
      categories,
      selectedCategoryIds,
    });
  } catch (error) {
    next(error);
  }
};

export const processProjectCategories = async (req, res, next) => {
  try {
    const id = req.params.id;
    const project = await getProjectDetails(id);
    if (!project) return res.status(404).send("Project not found");

    const submittedIds = req.body?.category_ids ?? [];
    const categoryIds = [...new Set(
      (Array.isArray(submittedIds) ? submittedIds : [submittedIds])
        .filter(Boolean)
        .map(String),
    )];
    const categories = await getAllCategories();
    if (categoryIds.some((categoryId) =>
      !categories.some(({ category_id }) => String(category_id) === categoryId)
    )) {
      return redirectWithFormError(req, res, {
        path: `/project/${id}/categories`,
        key: `projectCategoryIds:${id}`,
        formData: categoryIds.filter((categoryId) =>
          categories.some(({ category_id }) => String(category_id) === categoryId)
        ),
        message: "Choose valid categories.",
      });
    }

    await updateProjectCategories(id, categoryIds);
    req.session.notice = "Project categories updated successfully.";
    res.redirect(`/project/${id}`);
  } catch (error) {
    next(error);
  }
};