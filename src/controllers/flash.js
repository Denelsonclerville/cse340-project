export const consumeFormDraft = (req, key, fallback) => {
  const formData = req.session[key] ?? fallback;
  delete req.session[key];
  return formData;
};

export const redirectWithFormError = (req, res, { path, key, formData, message }) => {
  req.session.error = message;
  req.session[key] = formData;
  res.redirect(path);
};
