const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
{
    snowflake: String,
    img:
    {
        data: Buffer,
        contentType: String
    },
    author: String
});

module.exports = mongoose.model("Image", imageSchema);