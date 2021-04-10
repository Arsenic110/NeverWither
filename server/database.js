const mongoose = require("mongoose");
const config = require("./config");
const messageSchema = require("./schema/messageSchema");

var server = config.database.hostname;
var database = "/test";

class Database
{
    constructor()
    {
        this.connect();
    }

    connect()
    {
        mongoose.connect(server + database).then(() => console.log("Database: connection successful!")).catch(err => {throw err;});
    }

    GenerateSnowflake()
    {
        var snowflake = new Date().getTime();

        return snowflake.toString();
    }

    createMessage(contents, author)
    {
        var _message = new messageSchema(
            {
                snowflake: this.GenerateSnowflake(),
                contents: contents,
                author: author
            }
        );

        _message.save();//.then(doc => console.log(doc)).catch(err => console.error(err));
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

    // readMessage(callback, snowflake)
    // {
    //     messageSchema.findOne({snowflake:}).sort({_id:1}).exec((err, res) => { if(err) callback(err, null); else callback(null, res);});
    // }

    updateMessage(snowflake)
    {
        throw new Error("NotImplementedException");
    }

    deleteMessage(snowflake)
    {
        throw new Error("NotImplementedException");
    }


}

module.exports = new Database();