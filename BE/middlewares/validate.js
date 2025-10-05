const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const details = error.details.map((detail) => detail.message).join(', ');
    return res.status(400).json({ error: details });
  }
  next();
};

export default validate;