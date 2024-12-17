const Joi = require("joi");
const dummySchema = Joi.object({
  first_name: Joi.string().min(2).required(),
  phone_number: Joi.string()
    .pattern(/^\+91 \d{5}-\d{5}$/)
    .required(),
  last_name: Joi.string().min(2).required(),
}).unknown();
module.exports = dummySchema;
