export const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    req.session.error = "Please log in to continue.";
    return res.redirect("/login");
  }

  next();
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.session.user) {
    req.session.error = "Please log in to continue.";
    return res.redirect("/login");
  }

  if (req.session.user.role !== role) {
    req.session.error = "You do not have permission to view that page.";
    return res.redirect("/dashboard");
  }

  next();
};