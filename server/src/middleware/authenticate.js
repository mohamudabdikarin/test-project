const jwt = require("jsonwebtoken");
const env = require("../config/env");
const prisma = require("../config/db");
const ApiError = require("../utils/apiError");

const authenticate = async (req, res, next) => {
  // 1. Extract token from Authorization header or cookie
  let token = null;
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new ApiError(401, "Not authenticated. Please log in.");
  }

  // 2. Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired. Please log in again.");
    }
    throw new ApiError(401, "Invalid token.");
  }

  // 3. Fetch user and attach to request
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      companyId: true,
    },
  });

  if (!user || user.status !== "ACTIVE") {
    throw new ApiError(401, "User no longer exists or is deactivated.");
  }

  // 4. Attach user + companyId to request for downstream use
  req.user = user;
  req.companyId = user.companyId;

  next();
};

module.exports = authenticate;
