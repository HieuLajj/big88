var Chat = require("./../models/Chat");
module.exports = class ChatServer{
    constructor(){
        this.socket;
    }
    createEvents(){
        let chatServer = this;
        let socket = chatServer.socket;
        socket.on('ChatCommunity', function(data){
            const obj = JSON.parse(data);
            var newChat = new Chat({
                Name:obj.name,
                ChatText:obj.textchat,
                Ngay:Date.now()
            })
            newChat.save(function(e){
                if(!e){
                    console.log("luu thanh cong");
                }
            })
            socket.broadcast.emit('ReChatCommunity',data);
        })
    }
}