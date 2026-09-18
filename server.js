import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { getAllCategories } from "./src/models/categories.js";
import { getAllOrganizations } from "./src/models/organizations.js";
import { getAllProjects } from "./src/models/projects.js";

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  try {
    const projects = await getAllProjects();
    res.render("index", {
      title: "Serve Together",
      featuredProjects: projects.slice(0, 3),
      projectCount: projects.length,
    });
  } catch (error) {
    console.error("Unable to load featured projects:", error);
    res.status(500).render("index", { title: "Serve Together", featuredProjects: [], projectCount: 0 });
  }
});

app.get("/organizations", async (req, res) => {
  try {
    const organizations = await getAllOrganizations();
    res.render("organizations", { title: "Organizations", organizations });
  } catch (error) {
    console.error("Unable to load organizations:", error);
    res.status(500).render("organizations", { title: "Organizations", organizations: [] });
  }
});

app.get("/projects", async (req, res) => {
  try {
    const projects = await getAllProjects();
    res.render("projects", { title: "Service Projects", projects });
  } catch (error) {
    console.error("Unable to load projects:", error);
    res.status(500).render("projects", { title: "Service Projects", projects: [] });
  }
});

app.get("/categories", async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.render("categories", {
      title: "Project Categories",
      categories,
      errorMessage: null,
    });
  } catch (error) {
    console.error("Unable to load categories:", error);
    res.status(500).render("categories", {
      title: "Project Categories",
      categories: [],
      errorMessage: "Categories are temporarily unavailable. Please try again later.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});