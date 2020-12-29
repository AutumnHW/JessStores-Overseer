const Discord = require("discord.js");
const fs = require('fs');
const info = {
    aliases: [],
    usage: "",
    description: "Provides the bot's ping."
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
    try {
        let pingembed = new Discord.MessageEmbed()
            .setTitle('Pong!')
            .addField(`Bot Ping`, `**${client.ws.ping}** ms`, true)
            .addField(`API Ping`, `**Counting...**`, true)
            .addField(`Uptime`, `**${milliseconverter(client.uptime)}**`)
            .setTimestamp()
            .setColor(15105570)
            .setFooter(`Requested by ${msg.author.username}`);
        let pingmsg = await msg.channel.send(pingembed);
        let startcount = Date.now();
        await pingmsg.edit(pingembed);
        let endcount = Date.now();
        pingembed = new Discord.MessageEmbed()
            .setTitle('Pong!')
            .addField(`Bot Ping`, `**${client.ws.ping}** ms`, true)
            .addField(`API Ping`, `**${endcount - startcount}** ms`, true)
            .addField(`Uptime`, `**${milliseconverter(client.uptime)}**`, true)
            .setTimestamp()
            .setColor(15105570)
            .setFooter(`Requested by ${msg.author.username}`);
        await pingmsg.edit(pingembed);
    } catch (err) {
        if (err) { client.channels.cache.get("720367748437508117").send("An error happened " + `at file ${err.fileName} at line ${err.lineNumber} at column ${err.columnNumber}` + "!\n```\n" + err.toString() + "\n```") };
    }
}

module.exports = {
    command,
    info
}