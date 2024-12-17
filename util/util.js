const validateInput = (data, schema) => {
  const { error } = schema.validate(data);
  if (error) {
    return error.details[0].message; // Return the error message
  }
  return null;
};
module.exports = validateInput;
