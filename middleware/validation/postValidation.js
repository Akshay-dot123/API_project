const Joi = require("joi");
const Schema = Joi.object({
  email: Joi.string()
    .email()
    .regex(/^[a-z]+[._-]?[a-z0-9]*@(gmail\.com|.*\.in)$/)
    .message("No capital case and Email should end by '@gmail.com/in' ")
    .required(),
  password: Joi.string().min(6).required(),
});

module.exports = Schema;
