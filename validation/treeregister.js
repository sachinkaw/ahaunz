const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateTreeRegisterInput(data) {
  let errors = {};

  data.passcode = !isEmpty(data.passcode) ? data.passcode : "";
  data.whanau = !isEmpty(data.whanau) ? data.whanau : "";

  if (!Validator.isLength(data.passcode, { min: 2, max: 30 })) {
    errors.passcode = "Whanau passcode must be between 2 and 30 characters";
  }

  if (!Validator.isLength(data.whanau, { min: 2, max: 30 })) {
    errors.whanau = "Whanau name must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.whanau)) {
    errors.whanau = "A whanau name is required";
  }

  if (Validator.isEmpty(data.passcode)) {
    errors.name = "A whanau passcode field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
