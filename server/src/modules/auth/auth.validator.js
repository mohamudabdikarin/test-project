const ApiError = require("../../utils/apiError");

const validateRegister = (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    throw new ApiError(400, "All fields are required: email, password, firstName, lastName");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  if (firstName.trim().length < 2 || lastName.trim().length < 2) {
    throw new ApiError(400, "First and last name must be at least 2 characters");
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  next();
};

module.exports = { validateRegister, validateLogin };
