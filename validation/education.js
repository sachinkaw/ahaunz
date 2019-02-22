const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
  let errors = {};

  data.field = !isEmpty(data.field) ? data.field : "";
  data.school = !isEmpty(data.school) ? data.school : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.school)) {
    errors.school = "School field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
