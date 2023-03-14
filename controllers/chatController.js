const Chat = require("../models/Chat");
const chatController = {
    loadChat: async(req,res) =>{
        const chat = await Chat.find().sort({Ngay: -1 }).limit(10);
        res.send(JSON.stringify(chat));
    }
}
module.exports = chatController;