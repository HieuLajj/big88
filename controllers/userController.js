const User = require("../models/user");
const userController = {
    userLogin: async(req,res) => {
        res.json({success:"lai van hieu thanh cong"});
    },









    //test
    add_user: async(req,res)=>{
        const {name,email,addresswallet} = req.body
            const user = await User({
                name,
                email,
                addresswallet 
            })
            await user.save();
            res.json(user);
        }
}
module.exports = userController;