const router = require("express").Router();
const ctrl = require("./company.controller");
const authenticate = require("../../middleware/authenticate");
const authorize = require("../../middleware/authorize");

router.use(authenticate);

router.get("/profile", ctrl.getCompanyProfile);
router.get("/members", ctrl.getCompanyMembers);
router.patch("/profile", authorize("ADMIN"), ctrl.updateCompanyProfile);
router.patch("/config", authorize("ADMIN"), ctrl.updateConfig);

module.exports = router;
