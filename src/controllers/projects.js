import {
  getProjectDetails,
  getProjectsByCategoryId,
  getUpcomingProjects,
} from "../models/projects.js";
import { getCategoriesByProjectId } from "../models/categories.js";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

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

    res.render("project", { title: project.title, project, categories });
  } catch (error) {
    next(error);
  }
};