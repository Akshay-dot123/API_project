const Joi = require("joi");
const userSchema = Joi.object({
  age: Joi.number().required(),
  date_of_birth: Joi.date().required(),
  gender: Joi.number().valid(0, 1, 2).required(),
});

module.exports = userSchema;
