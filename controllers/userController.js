const User = require("../models/user");
const userController = {
    userLogin: async(req,res) => {
        const {addresswallet} = req.body;
        console.log(addresswallet);
        const user = await User.findOne({addresswallet});
        if (!user){
            return  res.send(JSON.stringify({
                        success: false,
                        message: 'user not found, with the given email!',
                    }))
        }  
        console.log(user+"hmm");
        res.send(JSON.stringify(user))
    },


    //test
    add_user: async(req,res)=>{
        const {name,email,addresswallet} = req.body;
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