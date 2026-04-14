const projectsService = require("./projects.service");
const { sendSuccess } = require("../../utils/apiResponse");

const listProjects = async (req, res) => {
  const result = await projectsService.list(req.companyId, req.query);
  sendSuccess(res, 200, result, "Projects fetched");
};

const getProject = async (req, res) => {
  const project = await projectsService.getById(req.params.id, req.companyId);
  sendSuccess(res, 200, { project }, "Project fetched");
};

const createProject = async (req, res) => {
  const project = await projectsService.create(req.body, req.user.id, req.companyId);
  sendSuccess(res, 201, { project }, "Project created");
};

const updateProject = async (req, res) => {
  const project = await projectsService.update(req.params.id, req.body, req.companyId);
  sendSuccess(res, 200, { project }, "Project updated");
};

const deleteProject = async (req, res) => {
  await projectsService.remove(req.params.id, req.companyId);
  sendSuccess(res, 200, null, "Project deleted");
};

const getProjectStats = async (req, res) => {
  const stats = await projectsService.getStats(req.companyId);
  sendSuccess(res, 200, { stats }, "Stats fetched");
};

module.exports = { listProjects, getProject, createProject, updateProject, deleteProject, getProjectStats };
