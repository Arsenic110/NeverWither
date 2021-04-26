const mongoose = require("mongoose");
const config = require("./config");
const messageSchema = require("./schema/messageSchema");
const imageSchema = require("./schema/imageSchema");

const server = config.database.hostname;
const messagesTable = config.table.messages;
const usersTable = config.table.users;
const smallFilesTable =  config.table.smallFiles;
const largeFilesTable = config.table.largeFiles;

class Database
{
    constructor()
    {
        this.connect();
    }

    connect()
    {
        //testing with messagesTable only for now--
        mongoose.connect(server).then(() => console.log("Database: connection successful!")).catch(err => {throw err;});
    }

    GenerateSnowflake()
    {
        var snowflake = new Date().getTime();

        return snowflake.toString();
    }

    createMessage(contents, author, callback)
    {
        var _message = new messageSchema(
            {
                snowflake: this.GenerateSnowflake(),
                contents: contents,
                author: author
            }
        );

        _message.save().then(callback(null, _message)).catch((err) => {callback(err, null)});
    }

    createMessageWithSnowflake(contents, author, callback, snowflake)
    {
        var _message = new messageSchema(
            {
                snowflake: snowflake,
                contents: contents,
                author: author
            }
        );

        _message.save().then(callback(null, _message)).catch((err) => {callback(err, null)});
    }

    readMessage(callback)
    {
        messageSchema
            .findOne()
            .limit(1)
            .sort({_id:-1})
            .exec((err, res) => 
            {
                if(err) callback(err, null);
                else callback(null, res);
                console.log(res);
            });
    }

    readMessages(callback)
    {
        messageSchema
            .find()
            .limit(100)
            //.lean()
            .sort({_id:-1})
            .exec((err, res) => 
            {
                if(err) callback(err, null);
                else callback(null, Object.values(res));
                //console.log(res);
            });
    }

    updateMessage(snowflake)
    {
        throw new Error("NotImplementedException");
    }

    deleteMessage(snowflake)
    {
        throw new Error("NotImplementedException");
    }

    dropMessages()
    {
        messageSchema.collection.drop();
    }

    createImage(contents, author, callback)
    {
        var sf = this.GenerateSnowflake();

        //woohoo big brain (no way this will work lmao)
        var _image = new imageSchema(
            {
                snowflake: sf,
                img: contents,
                author: author
            }
        );

        var _str = "<img src=\"/content/" + sf + "\">";

        _image.save().then(this.createMessageWithSnowflake(_str, author, callback, sf));
        //OKAY THIS WORKS DONT TOUCH IT EEEEEEEEEEEEEEEEe

    }

    readImage(snowflake, callback)
    {
        imageSchema
            .findOne({snowflake: snowflake})
            .exec((err, res) => 
            {
                if(err || !res) callback(err, null);
                else callback(null, res);
            });
    }

}

module.exports = new Database();