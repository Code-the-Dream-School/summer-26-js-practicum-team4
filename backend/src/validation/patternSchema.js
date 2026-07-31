const Joi = require("joi");

const patternSchema = Joi.object({
  patternName: Joi.string().trim().min(3).max(30).required().messages({
    "string.min": "Pattern name must be at least 3 characters long.",
    "string.max": "Pattern name must be no more than 30 characters long.",
  }),
  originalImgUrl: Joi.string().uri().required(),
  patternImgUrl: Joi.string().uri().required(),
});

const patternUpdateSchema = Joi.object({
  patternName: Joi.string().trim().min(3).max(30).messages({
    "string.min": "Pattern name must be at least 3 characters long.",
    "string.max": "Pattern name must be no more than 30 characters long.",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update.",
  });

module.exports = {
  patternSchema,
  patternUpdateSchema,
};
