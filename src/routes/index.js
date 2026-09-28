import express from "express";
import { showHomePage } from "../controllers/home.js";
import {
  showProjectsPage,
  showProjectDetailsPage,
} from "../controllers/projects.js";
import {
  showAddCategoryPage,
  showCategoriesPage,
  showCategoryDetailsPage,
  showEditCategoryPage,
  processAddCategory,
  processEditCategory,
} from "../controllers/categories.js";
import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
} from "../controllers/organizations.js";

const router = express.Router();

router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);
router.get("/organization/:id", showOrganizationDetailsPage);
router.get("/projects", showProjectsPage);
router.get("/project/:id", showProjectDetailsPage);
router.get("/categories", showCategoriesPage);
router.get("/new-category", showAddCategoryPage);
router.post("/new-category", processAddCategory);
router.get("/category/:id", showCategoryDetailsPage);
router.get("/edit-category/:id", showEditCategoryPage);
router.post("/edit-category/:id", processEditCategory);

export default router;