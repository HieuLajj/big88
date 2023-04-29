const Chat = require("../models/Chat");
const chatController = {
    loadChat: async(req,res) =>{
        const chat = await Chat.find().sort({Ngay: -1 }).limit(10).populate("userID");
        //res.send(JSON.stringify(chat));
        let chat2 = chat.map((data)=>{
            return{
                Name: data.userID.name,
                ChatText: data.ChatText,
            }
        })
        res.json(chat2)
    }
}
module.exports = chatController;