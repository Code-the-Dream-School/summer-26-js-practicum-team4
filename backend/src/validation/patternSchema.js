const Joi = require("joi");

const patternParameters = {
  stitchWidth: Joi.number().integer().min(10).max(200).messages({
    "number.base": "Stitch width must be a number.",
    "number.integer": "Stitch width must be an integer.",
    "number.min": "Stitch width must be at least 10.",
    "number.max": "Stitch width must be no more than 200.",
  }),
  stitchHeight: Joi.number().integer().min(10).max(200).messages({
    "number.base": "Stitch height must be a number.",
    "number.integer": "Stitch height must be an integer.",
    "number.min": "Stitch height must be at least 10.",
    "number.max": "Stitch height must be no more than 200.",
  }),
  maxColors: Joi.number().integer().min(1).messages({
    "number.base": "Max colors must be a number.",
    "number.integer": "Max colors must be an integer.",
    "number.min": "Max colors must be at least 1.",
  }),
};

const patternSchema = Joi.object({
  patternName: Joi.string().trim().min(3).max(30).required().messages({
    "string.min": "Pattern name must be at least 3 characters long.",
    "string.max": "Pattern name must be no more than 30 characters long.",
  }),
  originalImgUrl: Joi.string().uri().required(),
  patternImgUrl: Joi.string().uri().required(),
  ...patternParameters,
});

const patternUpdateSchema = Joi.object({
  patternName: Joi.string().trim().min(3).max(30).messages({
    "string.min": "Pattern name must be at least 3 characters long.",
    "string.max": "Pattern name must be no more than 30 characters long.",
  }),
  ...patternParameters,
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update.",
  });

module.exports = {
  patternSchema,
  patternUpdateSchema,
};
