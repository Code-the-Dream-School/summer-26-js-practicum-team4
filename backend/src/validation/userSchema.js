const Joi = require("joi");

const userSchema = Joi.object({
  userName: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(/^\S+$/)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()+-]).+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain uppercase letter, lowercase letter, number, special character, and no spaces.",
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password must be no more than 100 characters long.",
    }),
});

module.exports = {
  userSchema,
};
