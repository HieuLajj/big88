const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(moongose);
const roundSchema = new mongoose.Schema({
    small_money: Number,
    small_players: Number,
    big_money: Number,
    big_players: Number,
    counter: Number,
    result: Number,
    dateCreated : Date
});
roundSchema.plugin(AutoIncrement, {inc_field: "roundNumber"});
module.exports = mongoose.model("round", roundSchema);