import {
  createUser,
  findUserByEmail,
  getAllUsers,
  validatePassword,
} from "../models/users.js";

export const showLoginPage = (req, res) => {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }

  res.render("login", { title: "Log In" });
};

export const processLogin = async (req, res, next) => {
  try {
    const email = String(req.body?.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password ?? "");
    const user = await findUserByEmail(email);

    if (!user || !(await validatePassword(password, user.password_hash))) {
      return res.status(401).render("login", {
        title: "Log In",
        error: "Email or password is incorrect.",
      });
    }

    req.session.regenerate((error) => {
      if (error) {
        return next(error);
      }
      req.session.user = {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      res.redirect("/dashboard");
    });
  } catch (error) {
    next(error);
  }
};

export const showRegisterPage = (req, res) => {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }

  res.render("register", {
    title: "Create Account",
    formData: { name: "", email: "" },
  });
};

export const processRegister = async (req, res, next) => {
  const formData = {
    name: String(req.body?.name ?? "").trim(),
    email: String(req.body?.email ?? "")
      .trim()
      .toLowerCase(),
  };
  const password = String(req.body?.password ?? "");
  const passwordBytes = Buffer.byteLength(password, "utf8");

  if (!formData.name || formData.name.length > 150) {
    return res.status(400).render("register", {
      title: "Create Account",
      formData,
      error: "Enter a name of 1 to 150 characters.",
    });
  }
  if (
    formData.email.length > 255 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  ) {
    return res.status(400).render("register", {
      title: "Create Account",
      formData,
      error: "Enter a valid email address.",
    });
  }
  if (passwordBytes < 8 || passwordBytes > 72) {
    return res.status(400).render("register", {
      title: "Create Account",
      formData,
      error: "Password must be between 8 and 72 bytes.",
    });
  }

  try {
    await createUser({ ...formData, password });
    req.session.notice = "Your account was created. Please log in.";
    res.redirect("/login");
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).render("register", {
        title: "Create Account",
        formData,
        error: "An account with that email already exists.",
      });
    }
    next(error);
  }
};

export const processLogout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
};

export const showDashboard = (req, res) => {
  res.render("dashboard", { title: "Dashboard" });
};

export const showUsersPage = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.render("users", { title: "Users", users });
  } catch (error) {
    next(error);
  }
};
