const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/login",userController.userLogin);


//test
router.post("/add_user",userController.add_user);
module.exports = router;