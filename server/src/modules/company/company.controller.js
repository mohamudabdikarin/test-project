const prisma = require("../../config/db");
const ApiError = require("../../utils/apiError");
const { sendSuccess } = require("../../utils/apiResponse");

const getCompanyProfile = async (req, res) => {
  const company = await prisma.companyProfile.findUnique({
    where: { id: req.companyId },
    include: {
      config: true,
      _count: { select: { users: true, projects: true } },
    },
  });

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  sendSuccess(res, 200, { company }, "Company profile fetched");
};

const getCompanyMembers = async (req, res) => {
  const members = await prisma.user.findMany({
    where: { companyId: req.companyId, isActive: true },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      avatar: true,
      lastLogin: true,
    },
    orderBy: { firstName: "asc" },
  });

  sendSuccess(res, 200, { members, total: members.length }, "Members fetched");
};

const updateConfig = async (req, res) => {
  const { timezone, dateFormat, currency, maxProjects, allowPublicShare } = req.body;

  const config = await prisma.systemConfig.findUnique({
    where: { companyId: req.companyId },
  });

  if (!config) {
    throw new ApiError(404, "System config not found");
  }

  const updateData = {};
  if (timezone !== undefined) updateData.timezone = timezone;
  if (dateFormat !== undefined) updateData.dateFormat = dateFormat;
  if (currency !== undefined) updateData.currency = currency;
  if (maxProjects !== undefined) updateData.maxProjects = Number(maxProjects);
  if (allowPublicShare !== undefined) updateData.allowPublicShare = Boolean(allowPublicShare);

  const updated = await prisma.systemConfig.update({
    where: { companyId: req.companyId },
    data: updateData,
  });

  sendSuccess(res, 200, { config: updated }, "Settings updated");
};

const updateCompanyProfile = async (req, res) => {
  const { name, industry, address, phone, email, website } = req.body;

  const updateData = {};
  if (name !== undefined) updateData.name = name.trim();
  if (industry !== undefined) updateData.industry = industry;
  if (address !== undefined) updateData.address = address;
  if (phone !== undefined) updateData.phone = phone;
  if (email !== undefined) updateData.email = email;
  if (website !== undefined) updateData.website = website;

  const company = await prisma.companyProfile.update({
    where: { id: req.companyId },
    data: updateData,
  });

  sendSuccess(res, 200, { company }, "Company profile updated");
};

module.exports = { getCompanyProfile, getCompanyMembers, updateConfig, updateCompanyProfile };
