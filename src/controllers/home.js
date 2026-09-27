import { getHomePageData } from "../models/projects.js";

export const showHomePage = async (req, res, next) => {
  try {
    const homePageData = await getHomePageData();
    res.render("index", { title: "Serve Together", ...homePageData });
  } catch (error) {
    next(error);
  }
};