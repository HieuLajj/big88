const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    email:{
        type: String,
    },
    name:{
        type: String,
    },
    avatar:{
        type: String,
    },
    profit:{
        type: Number,
    },
    lose:{
        type: Number,
    },
    followers:{
        type: Array,
        default:[]
    },
    followins:{
        type: Array,
        default:[]
    },
    addresswallet:{
        type: String,
    }
});
module.exports = mongoose.model("User",userSchema);