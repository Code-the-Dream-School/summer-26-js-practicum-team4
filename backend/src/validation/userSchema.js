const Joi = require("joi");

const passwordSchema = Joi.string()
  .min(8)
  .max(100)
  .pattern(/^\S+$/)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()+-]).+$/)
  .messages({
    "string.pattern.base":
      "Password must contain uppercase letter, lowercase letter, number, special character, and no spaces.",
    "string.min": "Password must be at least 8 characters long.",
    "string.max": "Password must be no more than 100 characters long.",
  });

const userSchema = Joi.object({
  userName: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: passwordSchema.optional(),
  userProfileImgUrl: Joi.string().uri().optional(),
  reCaptchaToken: Joi.string().required(),
});

const userUpdateSchema = Joi.object({
  userName: Joi.string().trim().min(3).max(30),
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
  userProfileImgUrl: Joi.string().uri().allow(null),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update.",
  });

module.exports = {
  userSchema,
  userUpdateSchema,
};
