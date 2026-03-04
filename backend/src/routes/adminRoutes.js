const express = require("express");
const router = express.Router();
const controller = require("../controllers/adminController");

router.get("/users", controller.getUsers);
router.get("/messages/:user", controller.getMessages);
router.get("/stats", controller.getStats);
router.post("/send", controller.sendMessage);

module.exports = router;