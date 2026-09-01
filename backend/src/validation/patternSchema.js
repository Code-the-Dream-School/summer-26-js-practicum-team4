const Joi = require("joi");

const paletteSchema = Joi.object({
  dmcCode: Joi.string().required().messages({
    "string.base": "dmcCode must be a number.",
  }),
  name: Joi.string().required().messages({
    "string.base": "Name must be a string.",
  }),
  r: Joi.number().integer().min(0).max(255).required().messages({
    "number.base": "r must be a number.",
    "number.integer": "r must be an integer.",
    "number.min": "r must be at least 0.",
    "number.max": "r must be no more than 255.",
  }),
  g: Joi.number().integer().min(0).max(255).required().messages({
    "number.base": "g must be a number.",
    "number.integer": "g must be an integer.",
    "number.min": "g must be at least 0.",
    "number.max": "g must be no more than 255.",
  }),
  b: Joi.number().integer().min(0).max(255).required().messages({
    "number.base": "b must be a number.",
    "number.integer": "b must be an integer.",
    "number.min": "b must be at least 0.",
    "number.max": "b must be no more than 255.",
  }),
  symbol: Joi.string().trim().min(1).max(1).required().messages({
    "string.min": "Symbol must be exactly 1 character.",
    "string.max": "Symbol must be exactly 1 character.",
  }),
});

const gridSchema = Joi.number().integer().messages({
  "number.base": "Grid index must be a number",
  "number.integer": "Grid index must be an integer",
});

const patternParameters = {
  stitchWidth: Joi.number().integer().min(10).max(200).required().messages({
    "number.base": "Stitch width must be a number.",
    "number.integer": "Stitch width must be an integer.",
    "number.min": "Stitch width must be at least 10.",
    "number.max": "Stitch width must be no more than 200.",
  }),
  stitchHeight: Joi.number().integer().min(10).max(200).required().messages({
    "number.base": "Stitch height must be a number.",
    "number.integer": "Stitch height must be an integer.",
    "number.min": "Stitch height must be at least 10.",
    "number.max": "Stitch height must be no more than 200.",
  }),
  palette: Joi.array().items(paletteSchema),
  grid: Joi.array().items(gridSchema),
};

const patternSchema = Joi.object({
  patternName: Joi.string().trim().min(3).max(30).required().messages({
    "string.min": "Pattern name must be at least 3 characters long.",
    "string.max": "Pattern name must be no more than 30 characters long.",
  }),
  originalImgUrl: Joi.string().uri().optional(),
  patternImgUrl: Joi.string().uri().optional(),
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

const patternGenerationSchema = Joi.object({
  width: Joi.number().integer().min(10).max(200),
  height: Joi.number().integer().min(10).max(200),
}).xor("width", "height");

module.exports = {
  patternSchema,
  patternUpdateSchema,
  patternGenerationSchema,
};
