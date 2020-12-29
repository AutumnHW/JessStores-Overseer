const Discord = require("discord.js");
const fs = require('fs');
const info = {
    aliases: [],
    usage: "",
    description: "Fuck.",
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
    msg.channel.send({
        files: ['https://cdn.discordapp.com/attachments/706048185029754960/734916757046689823/HeH.mp4']
    })
}

module.exports = {
    command,
    info
}