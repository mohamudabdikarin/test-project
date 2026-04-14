const router = require("express").Router();
const ctrl = require("./projects.controller");
const { validateCreateProject, validateUpdateProject } = require("./projects.validator");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");

// All project routes require authentication
router.use(authenticate);

router.get("/stats", ctrl.getProjectStats);
router.get("/", ctrl.listProjects);
router.get("/:id", ctrl.getProject);

// Create/Update/Delete — ADMIN and MANAGER only
router.post("/", authorize("ADMIN", "MANAGER"), validateCreateProject, ctrl.createProject);
router.patch("/:id", authorize("ADMIN", "MANAGER"), validateUpdateProject, ctrl.updateProject);
router.delete("/:id", authorize("ADMIN"), ctrl.deleteProject);

module.exports = router;
