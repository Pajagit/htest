import Validator from "validator";
import isEmpty from "../validation/isEmpty";

const UserValidation = data => {
  var firstNameLimitMin = 2;
  var firstNameLimitMax = 30;
  var lastNameLimitMin = 2;
  var lastNameLimitMax = 30;
  var positionLimitMin = 2;
  var positionLimitMax = 30;
  var urlImageLimitMax = 255;

  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.first_name = !isEmpty(data.first_name) ? data.first_name : "";
  data.last_name = !isEmpty(data.last_name) ? data.last_name : "";
  data.position = !isEmpty(data.position) ? data.position : "";
  data.image_url = !isEmpty(data.image_url) ? data.image_url : "";

  // Title validation
  if (isEmpty(data.email)) {
    errors.email = "Email is a required field";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  //First name validation
  if (!isEmpty(data.first_name)) {
    if (data.first_name.length > firstNameLimitMax || data.first_name.length < firstNameLimitMin) {
      errors.first_name = `First name must be between ${firstNameLimitMin} and ${firstNameLimitMax} characters long (${data.first_name.length})`;
    }
  }

  //Last name validation
  if (!isEmpty(data.last_name)) {
    if (data.last_name.length > lastNameLimitMax || data.last_name.length < lastNameLimitMin) {
      errors.last_name = `Last name must be between ${lastNameLimitMin} and ${lastNameLimitMax} characters long (${data.last_name.length})`;
    }
  }

  //Position validation
  if (!isEmpty(data.position)) {
    if (data.position.length > positionLimitMax || data.position.length < positionLimitMin) {
      errors.position = `Position must be between ${positionLimitMin} and ${positionLimitMax} characters long (${data.position.length})`;
    }
  }

  //Image url validation
  if (!isEmpty(data.image_url)) {
    if (data.image_url.length > urlImageLimitMax) {
      errors.image_url = `Image url can not be more than ${urlImageLimitMax} long (${data.image_url.length})`;
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default UserValidation;
