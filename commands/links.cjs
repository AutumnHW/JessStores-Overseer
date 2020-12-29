const Discord = require("discord.js");
const fs = require('fs');
const info = {
    aliases: [],
    usage: "",
    description: "Sends important links.",
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
    let embed = new Discord.MessageEmbed()
        .setTitle('Links')
        .setTimestamp()
        .setColor(15105570)
        .setFooter(`Requested by ${msg.author.tag}`)
        .setDescription(`[Bot Invite](https://discord.com/oauth2/authorize?client_id=663989176374525963&scope=bot&permissions=67497025)\n[Server](http://discord.gg/MqWbSSH)\n[Website](https://store.fizzylafizz.com/home)`)
    await msg.channel.send(embed)
}

module.exports = {
    command,
    info
}