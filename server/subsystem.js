

class Subsystem 
{
    //one thing I hate about JS classes is that the variables are never declared and are referenced only inside of functions.

    //test static function (why does it not have a function declaration?? god JS syntax is so inconsistent)
    static WriteToConsole(text)                         //I mean I guess I could write something like 
    {                                                   //static WriteToConsole = function(text) 
        console.log(text);                              //but something tells me thats even worse
    }

    //really basic snowflake.. basically just Unix timestamp.
    

}

module.exports = 
{ 
//variable name: variable value
    Subsystem: Subsystem
}