import express from "express";
import { fileURLToPath } from "url";
import path from "path";

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Serve Together",
    featuredProjects: [
      { name: "Park Cleanup", category: "Environment", location: "Riverside", spots: 8 },
      { name: "Food Drive", category: "Community Service", location: "Downtown", spots: 5 },
      { name: "Community Tutoring", category: "Education", location: "Eastside", spots: 12 },
    ],
  });
});

app.get("/organizations", (req, res) => {
  res.render("organizations", {
    title: "Organizations",
    organizations: [
      { name: "BrightFuture Builders", focus: "Community construction and support", projects: 4, image: "/images/brightfuture-logo.png" },
      { name: "GreenHarvest Growers", focus: "Community gardens and food access", projects: 3, image: "/images/greenharvest-logo.png" },
      { name: "UnityServe Volunteers", focus: "Neighbors helping neighbors", projects: 5, image: "/images/unityserve-logo.png" },
    ],
  });
});

app.get("/projects", (req, res) => {
  res.render("projects", {
    title: "Service Projects",
    projects: [
      { name: "Park Cleanup", category: "Environment", location: "Riverside", date: "Every Saturday" },
      { name: "Food Drive", category: "Community Service", location: "Downtown", date: "June 15" },
      { name: "Community Tutoring", category: "Education", location: "Eastside", date: "June 22" },
      { name: "Wellness Walk", category: "Health and Wellness", location: "Central Park", date: "June 29" },
    ],
  });
});

app.get("/categories", (req, res) => {
  res.render("categories", {
    title: "Project Categories",
    categories: [
      { name: "Environmental", description: "Care for parks, gardens, and local wildlife.", count: 12 },
      { name: "Educational", description: "Help learners grow through tutoring and mentoring.", count: 8 },
      { name: "Community Service", description: "Strengthen neighborhoods through practical support.", count: 15 },
      { name: "Health and Wellness", description: "Create healthier, more connected communities.", count: 6 },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});