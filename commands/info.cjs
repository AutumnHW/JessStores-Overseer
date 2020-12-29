const Discord = require("discord.js");
const fs = require('fs');
const info = {
    aliases: ["i"],
    usage: "",
    description: "Provides information about the bot."
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
        let package = require(`../package.json`)
        let date = client.readyAt;
        let infoembed = new Discord.MessageEmbed()
            .setTitle(client.user.username + " Information")
            .setTimestamp()
            .setColor(15105570)
            .setFooter("Information requested by " + msg.author.username)
            .setDescription(package.description)
            .addField("Ping", client.ws.ping + "ms", true)
            .addField("Uptime", milliseconverter(client.uptime), true)
            .addField(
                "Login Time",
                date.toLocaleDateString("en-GB", {
                    timeZone: "UTC",
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }) +
                " " +
                date.toLocaleTimeString("en-GB", {
                    timeZone: "UTC",
                    hour12: false
                }) +
                " GMT+0000"
            )

            .addField("Developer", package.author, true)
            .addField("Version", package.version, true)
        msg.channel.send(infoembed);
    } catch (err) {
        if (err) { client.channels.cache.get("720367748437508117").send("An error happened " + `at file ${err.fileName} at line ${err.lineNumber} at column ${err.columnNumber}` + "!\n```\n" + err.toString() + "\n```") };
    }
}

module.exports = {
    command,
    info
}