const authService = require("./auth.service");
const { sendSuccess } = require("../../utils/apiResponse");
const { setTokenCookie } = require("../../utils/jwt");

const register = async (req, res) => {
  const { email, password, firstName, lastName, companyId } = req.body;

  const { user, token } = await authService.register({
    email,
    password,
    firstName,
    lastName,
    companyId,
  });

  setTokenCookie(res, token);

  sendSuccess(res, 201, { user, token }, "Registration successful");
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await authService.login({ email, password });

  setTokenCookie(res, token);

  sendSuccess(res, 200, { user, token }, "Login successful");
};

const getMe = async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  sendSuccess(res, 200, { user }, "Profile fetched");
};

const logout = async (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  sendSuccess(res, 200, null, "Logged out successfully");
};

module.exports = { register, login, getMe, logout };
