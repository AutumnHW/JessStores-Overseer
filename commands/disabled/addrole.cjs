const Discord = require("discord.js");
const fs = require('fs');
//const prefix = "devfix";
const info = {
    aliases: [],
    usage: "<role ID>",
    description: "Test command.",
    hidden: true
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
    if (!ops.includes(msg.author.id)) return;
    msg.member.roles.add(msg.guild.roles.cache.get(args[0]))
}

module.exports = {
    command,
    //prefix,
    info
}