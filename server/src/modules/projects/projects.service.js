const prisma = require("../../config/db");
const ApiError = require("../../utils/apiError");

const list = async (companyId, query = {}) => {
  const { status, search, page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = { companyId };

  if (status) where.status = status;
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: Number(limit),
    }),
    prisma.project.count({ where }),
  ]);

  return {
    projects,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const getById = async (id, companyId) => {
  const project = await prisma.project.findFirst({
    where: { id, companyId },
    include: {
      company: { select: { id: true, name: true } },
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
};

const create = async (data, companyId) => {
  const project = await prisma.project.create({
    data: {
      name: data.name.trim(),
      status: data.status || "PLANNING",
      budget: data.budget || null,
      location: data.location || null,
      companyId,
    },
  });

  return project;
};

const update = async (id, data, companyId) => {
  const existing = await prisma.project.findFirst({
    where: { id, companyId },
  });

  if (!existing) {
    throw new ApiError(404, "Project not found");
  }

  // Build update payload — only include provided fields
  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name.trim();
  if (data.status !== undefined) updateData.status = data.status;
  if (data.budget !== undefined) updateData.budget = data.budget;
  if (data.location !== undefined) updateData.location = data.location;

  const project = await prisma.project.update({
    where: { id },
    data: updateData,
  });

  return project;
};

const remove = async (id, companyId) => {
  const existing = await prisma.project.findFirst({
    where: { id, companyId },
  });

  if (!existing) {
    throw new ApiError(404, "Project not found");
  }

  await prisma.project.delete({ where: { id } });
};

// Dashboard stats scoped to company
const getStats = async (companyId) => {
  const [total, byStatus, budgetAgg] = await Promise.all([
    prisma.project.count({ where: { companyId } }),
    prisma.project.groupBy({
      by: ["status"],
      where: { companyId },
      _count: true,
    }),
    prisma.project.aggregate({
      where: { companyId },
      _sum: { budget: true },
    }),
  ]);

  const statusMap = {};
  byStatus.forEach((s) => (statusMap[s.status] = s._count));

  return {
    total,
    byStatus: statusMap,
    totalBudget: budgetAgg._sum.budget || 0,
  };
};

module.exports = { list, getById, create, update, remove, getStats };
