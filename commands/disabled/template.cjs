const Discord = require("discord.js");
const fs = require('fs');
//const prefix = "devfix";
const info = {
    aliases: [],
    usage: "",
    description: "",
    hidden: false
}

const {
    finditem,
    milliseconverter,
    splice,
    countorder,
    reactioncollect,
    refundreaction,
    booltostring,
    numberWithCommas,
    numberWithoutCommas
} = require("../functions.cjs")

const command = async (client, msg, args, ops, processors) => {

}

module.exports = {
    command,
    //prefix,
    info
}