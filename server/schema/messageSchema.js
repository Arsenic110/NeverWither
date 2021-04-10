const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
{
    snowflake: String,
    contents: String,
    author: String
});

module.exports = mongoose.model("Message", messageSchema);