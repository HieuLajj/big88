const router = require("express").Router();
const userController = require("../controllers/userController");
const {isAuth} = require("../middlewares/auth")
router.post("/login",userController.userLogin);

//multer
const multer = require('multer');
const storage = multer.diskStorage({})
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb('invalid image file!', false);
    }
};
const uploads = multer({ storage, fileFilter });

//test
router.post("/add_user",userController.add_user);
router.post("/balance_user",userController.getBalaceUser);
router.post("/rounduser",userController.add_round)
router.post("/find_round",userController.find_round)
router.get("/find_round_gamehistory",userController.find_round_gamehistory);
router.post("/increasewin",isAuth, userController.increase_win);
router.post("/increaselose", isAuth, userController.increase_lose);
router.get("/getall", userController.getAll)
router.post("/update",isAuth,userController.updateProfile)
router.get("/searchuser", userController.findUser);

{profile: 'image'}
router.post('/uploadimage',isAuth, uploads.single('profile'),userController.updateImage);
module.exports = router;