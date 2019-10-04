const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (!Validator.isEmail(data.email)) {
    errors.emailLogin = "You have not entered a valid email address";
  }

  if (Validator.isEmpty(data.email)) {
    errors.emailLogin = "Email field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.passwordLogin = "Password field is required";
  }

  //{TODO}: input email and password match validation and error

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
