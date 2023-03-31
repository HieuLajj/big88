const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    gameID:{
        type: mongoose.Schema.Types.ObjectId, ref: "round" 
    },
    userID:{
        type: mongoose.Schema.Types.ObjectId, ref: "User" 
    },
    transactionID:{
        type: String
    },
    moneybet:{
        type: Number
    },
    bet:{
        type: Number
    }
});
module.exports = mongoose.model("UserRound",userSchema);