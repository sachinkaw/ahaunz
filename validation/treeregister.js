const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateTreeRegisterInput(data) {
  let errors = {};

  data.passcode = !isEmpty(data.passcode) ? data.passcode : "";

  if (!Validator.isLength(data.passocede, { min: 2, max: 30 })) {
    errors.name = "Passcode must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.passcode)) {
    errors.name = "Passcode field is required";
  }
  console.log("validateTreeRegisterInput", data.passcode);

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
