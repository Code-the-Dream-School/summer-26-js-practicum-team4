const Joi = require("joi");

const patternSchema = Joi.object({
  patternName: Joi.string().trim().min(3).max(30).required(),
  originalImgUrl: Joi.string().uri().required(),
  patternImgUrl: Joi.string().uri().required(),
});

const patternUpdateSchema = Joi.object({
  patternName: Joi.string().trim().min(3).max(30),
})
  .min(1)
  .message("At least one field must be provided for update.");

module.exports = {
  patternSchema,
  patternUpdateSchema,
};
