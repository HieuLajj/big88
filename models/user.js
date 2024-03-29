const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    status:{
        type: String,
    },
    email:{
        type: String,
    },
    name:{
        type: String,
    },
    avatar:{
        type: String,
        default: "",
    },
    profit:{
        type: Number,
        default: 0
    },
    lostmoney:{
        type: Number,
        default: 0
    },
    win:{
        type: Number,
        default: 0
    },
    lose:{
        type: Number,
        default: 0
    },
    addresswallet:{
        type: String,
    }
});
module.exports = mongoose.model("User",userSchema);