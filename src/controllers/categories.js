import {
  getAllCategories,
  getCategoryById,
  getCategoriesByProjectId,
} from "../models/categories.js";
import { getProjectsByCategoryId } from "../models/projects.js";

export const showCategoriesPage = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    res.render("categories", { title: "Project Categories", categories });
  } catch (error) {
    next(error);
  }
};

export const showCategoryDetailsPage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [category, projects] = await Promise.all([
      getCategoryById(id),
      getProjectsByCategoryId(id),
    ]);

    if (!category) {
      return res.status(404).send("Category not found");
    }

    res.render("category-details", { title: category.name, category, projects });
  } catch (error) {
    next(error);
  }
};