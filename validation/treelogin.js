const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateTreeLoginInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (Validator.isEmpty(data.whanau)) {
    errors.whanauLogin = "Whanau name is required";
  }

  if (Validator.isEmpty(data.passcode)) {
    errors.passcodeLogin = "Whanau passcode is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
