const router = require("express").Router();
const chatController = require("../controllers/chatController");
router.get("/chatCom",chatController.loadChat);
module.exports = router;