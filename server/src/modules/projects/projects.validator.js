const ApiError = require("../../utils/apiError");

const VALID_STATUSES = ["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"];
const VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const validateCreateProject = (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim().length < 2) {
    throw new ApiError(400, "Project name is required (min 2 characters)");
  }

  if (req.body.status && !VALID_STATUSES.includes(req.body.status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  if (req.body.priority && !VALID_PRIORITIES.includes(req.body.priority)) {
    throw new ApiError(400, `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(", ")}`);
  }

  if (req.body.progress !== undefined) {
    const p = Number(req.body.progress);
    if (isNaN(p) || p < 0 || p > 100) {
      throw new ApiError(400, "Progress must be a number between 0 and 100");
    }
  }

  if (req.body.budget !== undefined && Number(req.body.budget) < 0) {
    throw new ApiError(400, "Budget cannot be negative");
  }

  next();
};

const validateUpdateProject = (req, res, next) => {
  if (req.body.status && !VALID_STATUSES.includes(req.body.status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  if (req.body.priority && !VALID_PRIORITIES.includes(req.body.priority)) {
    throw new ApiError(400, `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(", ")}`);
  }

  if (req.body.progress !== undefined) {
    const p = Number(req.body.progress);
    if (isNaN(p) || p < 0 || p > 100) {
      throw new ApiError(400, "Progress must be a number between 0 and 100");
    }
  }

  next();
};

module.exports = { validateCreateProject, validateUpdateProject };
