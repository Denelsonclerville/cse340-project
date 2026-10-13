import express from "express";
import {
  processLogin,
  processLogout,
  processRegister,
  showDashboard,
  showLoginPage,
  showRegisterPage,
  showUsersPage,
} from "../controllers/auth.js";
import { requireLogin, requireRole } from "../middleware/auth.js";
import { showHomePage } from "../controllers/home.js";
import {
  showAddProjectPage,
  processAddProject,
  showEditProjectPage,
  processEditProject,
  showProjectsPage,
  showProjectDetailsPage,
  processVolunteerRemoval,
  processVolunteerSignup,
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
  showAddOrganizationPage,
  processAddOrganization,
  showEditOrganizationPage,
  processEditOrganization,
  showOrganizationsPage,
  showOrganizationDetailsPage,
} from "../controllers/organizations.js";

const router = express.Router();

router.get("/login", showLoginPage);
router.post("/login", processLogin);
router.get("/register", showRegisterPage);
router.post("/register", processRegister);
router.post("/logout", requireLogin, processLogout);
router.get("/dashboard", requireLogin, showDashboard);
router.get("/users", requireRole("admin"), showUsersPage);

router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);
router.get("/organization/:id", showOrganizationDetailsPage);
router.get(
  "/new-organization",
  requireLogin,
  requireRole("admin"),
  showAddOrganizationPage,
);
router.post(
  "/new-organization",
  requireLogin,
  requireRole("admin"),
  processAddOrganization,
);
router.get(
  "/edit-organization/:id",
  requireLogin,
  requireRole("admin"),
  showEditOrganizationPage,
);
router.post(
  "/edit-organization/:id",
  requireLogin,
  requireRole("admin"),
  processEditOrganization,
);
router.get("/projects", showProjectsPage);
router.get("/project/:id", showProjectDetailsPage);
router.post("/project/:id/volunteer", requireLogin, processVolunteerSignup);
router.post("/project/:id/unvolunteer", requireLogin, processVolunteerRemoval);
router.get(
  "/new-project",
  requireLogin,
  requireRole("admin"),
  showAddProjectPage,
);
router.post(
  "/new-project",
  requireLogin,
  requireRole("admin"),
  processAddProject,
);
router.get(
  "/edit-project/:id",
  requireLogin,
  requireRole("admin"),
  showEditProjectPage,
);
router.post(
  "/edit-project/:id",
  requireLogin,
  requireRole("admin"),
  processEditProject,
);
router.get("/categories", showCategoriesPage);
router.get(
  "/new-category",
  requireLogin,
  requireRole("admin"),
  showAddCategoryPage,
);
router.post(
  "/new-category",
  requireLogin,
  requireRole("admin"),
  processAddCategory,
);
router.get("/category/:id", showCategoryDetailsPage);
router.get(
  "/edit-category/:id",
  requireLogin,
  requireRole("admin"),
  showEditCategoryPage,
);
router.post(
  "/edit-category/:id",
  requireLogin,
  requireRole("admin"),
  processEditCategory,
);

export default router;
