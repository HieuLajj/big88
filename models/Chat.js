const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId, ref: "User" 
    },
    Name: String,
    ChatText: String,
    Ngay: Date
});
module.exports = mongoose.model("chat", chatSchema);