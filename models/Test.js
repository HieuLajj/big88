const moongose = require("mongoose");
const testSchema = new moongose.Schema({
    Email: String,
    Hoten: String,
    SoToken: String,
    Vi: String,
    Ngay: Date
});
module.exports = moongose.model("Test", testSchema);