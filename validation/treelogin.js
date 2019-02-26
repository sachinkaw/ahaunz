const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateTreeLoginInput(data) {
  let errors = {};

  data.passcode = !isEmpty(data.passcode) ? data.passcode : "";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
