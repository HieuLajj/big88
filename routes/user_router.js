const router = require("express").Router();
const userController = require("../controllers/userController");
const {isAuth} = require("../middlewares/auth")
router.post("/login",userController.userLogin);


//test
router.post("/add_user",userController.add_user);
router.post("/balance_user",userController.getBalaceUser);
router.post("/rounduser",userController.add_round)
router.post("/find_round",userController.find_round)
router.get("/find_round_gamehistory",userController.find_round_gamehistory);
router.post("/increasewin",isAuth, userController.increase_win);
router.post("/increaselose", isAuth, userController.increase_lose);
router.get("/getall", userController.getAll)
module.exports = router;