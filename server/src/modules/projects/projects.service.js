const prisma = require("../../config/db");
const ApiError = require("../../utils/apiError");

const USER_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  avatar: true,
  role: true,
};

const list = async (companyId, query = {}) => {
  const { status, priority, search, page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = { companyId };

  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      include: {
        createdBy: { select: USER_SELECT },
        assignee: { select: USER_SELECT },
      },
      orderBy: { updatedAt: "desc" },
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
      createdBy: { select: USER_SELECT },
      assignee: { select: USER_SELECT },
      company: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
};

const create = async (data, userId, companyId) => {
  // If assigneeId provided, verify they belong to the same company
  if (data.assigneeId) {
    const assignee = await prisma.user.findFirst({
      where: { id: data.assigneeId, companyId },
    });
    if (!assignee) {
      throw new ApiError(400, "Assignee not found in your company");
    }
  }

  const project = await prisma.project.create({
    data: {
      name: data.name.trim(),
      description: data.description || null,
      status: data.status || "PLANNING",
      priority: data.priority || "MEDIUM",
      budget: data.budget || null,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      progress: data.progress || 0,
      location: data.location || null,
      companyId,
      createdById: userId,
      assigneeId: data.assigneeId || null,
    },
    include: {
      createdBy: { select: USER_SELECT },
      assignee: { select: USER_SELECT },
    },
  });

  return project;
};

const update = async (id, data, companyId) => {
  // Verify project belongs to this company
  const existing = await prisma.project.findFirst({
    where: { id, companyId },
  });

  if (!existing) {
    throw new ApiError(404, "Project not found");
  }

  // If changing assignee, verify they belong to the same company
  if (data.assigneeId) {
    const assignee = await prisma.user.findFirst({
      where: { id: data.assigneeId, companyId },
    });
    if (!assignee) {
      throw new ApiError(400, "Assignee not found in your company");
    }
  }

  // Build update payload — only include provided fields
  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name.trim();
  if (data.description !== undefined) updateData.description = data.description;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.budget !== undefined) updateData.budget = data.budget;
  if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null;
  if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;
  if (data.progress !== undefined) updateData.progress = Number(data.progress);
  if (data.location !== undefined) updateData.location = data.location;
  if (data.assigneeId !== undefined) updateData.assigneeId = data.assigneeId || null;

  const project = await prisma.project.update({
    where: { id },
    data: updateData,
    include: {
      createdBy: { select: USER_SELECT },
      assignee: { select: USER_SELECT },
    },
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
  const [total, byStatus, byPriority, budgetAgg] = await Promise.all([
    prisma.project.count({ where: { companyId } }),
    prisma.project.groupBy({
      by: ["status"],
      where: { companyId },
      _count: true,
    }),
    prisma.project.groupBy({
      by: ["priority"],
      where: { companyId },
      _count: true,
    }),
    prisma.project.aggregate({
      where: { companyId },
      _sum: { budget: true },
      _avg: { progress: true },
    }),
  ]);

  const statusMap = {};
  byStatus.forEach((s) => (statusMap[s.status] = s._count));

  const priorityMap = {};
  byPriority.forEach((p) => (priorityMap[p.priority] = p._count));

  return {
    total,
    byStatus: statusMap,
    byPriority: priorityMap,
    totalBudget: budgetAgg._sum.budget || 0,
    avgProgress: Math.round(budgetAgg._avg.progress || 0),
  };
};

module.exports = { list, getById, create, update, remove, getStats };
