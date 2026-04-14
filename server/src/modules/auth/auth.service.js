const bcrypt = require("bcrypt");
const prisma = require("../../config/db");
const ApiError = require("../../utils/apiError");
const { generateToken } = require("../../utils/jwt");

const SALT_ROUNDS = 12;

const register = async ({ email, password, name, companyId }) => {
  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError(409, "A user with this email already exists");
  }

  // Verify company exists
  const company = await prisma.companyProfile.findUnique({ where: { id: companyId } });
  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase().trim(),
      password_hash: hashedPassword,
      name: name.trim(),
      companyId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      companyId: true,
    },
  });

  const token = generateToken(user.id);
  return { user, token };
};

const login = async ({ email, password }) => {
  // Find user with email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.status !== "ACTIVE") {
    throw new ApiError(403, "Account has been deactivated. Contact your admin.");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user.id);

  // Return user without password_hash
  const { password_hash: _, ...safeUser } = user;
  return { user: safeUser, token };
};

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      companyId: true,
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

module.exports = { register, login, getProfile };
