const moongose = require("mongoose");
const chatSchema = new moongose.Schema({
    Name: String,
    ChatText: String,
    Ngay: Date
});
module.exports = moongose.model("chat", chatSchema);