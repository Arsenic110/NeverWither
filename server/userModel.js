const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        snowflake: String,
        name: String
    }
);

module.exports = mongoose.model("users", userSchema);