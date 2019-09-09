const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateTestCaseInput(data) {
  const minTitleLength = 1;
  const maxTitleLength = 30;

  let errors = {};

  //add validation rules

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
