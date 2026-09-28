import {
  addCategory,
  getAllCategories,
  getCategoryById,
  getCategoriesByProjectId,
  updateCategory,
} from "../models/categories.js";
import { getProjectsByCategoryId } from "../models/projects.js";

const validateCategoryName = (name) => {
  const trimmedName = String(name ?? "").trim();

  if (!trimmedName) {
    return "Category name is required.";
  }

  if (trimmedName.length < 3) {
    return "Category name must be at least 3 characters long.";
  }

  if (trimmedName.length > 100) {
    return "Category name must be 100 characters or fewer.";
  }

  return null;
};

export const showCategoriesPage = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    res.render("categories", { title: "Project Categories", categories });
  } catch (error) {
    next(error);
  }
};

export const showAddCategoryPage = (req, res) => {
  res.render("new-category", {
    title: "Add Category",
    error: null,
    formData: { name: "" },
  });
};

export const processAddCategory = async (req, res, next) => {
  try {
    const name = String(req.body?.name ?? "").trim();
    const error = validateCategoryName(name);

    if (error) {
      return res.status(400).render("new-category", {
        title: "Add Category",
        error,
        formData: { name },
      });
    }

    await addCategory(name);
    res.redirect("/categories");
  } catch (error) {
    next(error);
  }
};

export const showEditCategoryPage = async (req, res, next) => {
  try {
    const category = await getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).send("Category not found");
    }

    res.render("edit-category", {
      title: "Edit Category",
      category,
      error: null,
      formData: { name: category.name },
    });
  } catch (error) {
    next(error);
  }
};

export const processEditCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await getCategoryById(id);

    if (!category) {
      return res.status(404).send("Category not found");
    }

    const name = String(req.body?.name ?? "").trim();
    const error = validateCategoryName(name);

    if (error) {
      return res.status(400).render("edit-category", {
        title: "Edit Category",
        category,
        error,
        formData: { name },
      });
    }

    await updateCategory(id, name);
    res.redirect("/categories");
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