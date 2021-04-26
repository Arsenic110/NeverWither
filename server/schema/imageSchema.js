const mongoose = require("mongoose");
const config = require("../config");

const imageSchema = new mongoose.Schema(
{
    snowflake: String,
    img: Buffer,
    author: String
});

module.exports = mongoose.model("Image", imageSchema);