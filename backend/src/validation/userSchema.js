const Joi = require("joi");

const userSchema = Joi.object({
  userName: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string()
    .trim()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-+]).+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",}),
});

module.exports = {
  userSchema,
};
