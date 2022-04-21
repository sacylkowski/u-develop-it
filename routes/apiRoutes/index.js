const express = require("express");
const req = require("express/lib/request");
const router = express.Router();

router.use(require("./candidateRoutes"));
router.use(require("./partyRoutes"));

module.exports = router;