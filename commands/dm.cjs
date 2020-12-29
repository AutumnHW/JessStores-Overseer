const Discord = require("discord.js");
const fs = require('fs');
const info = {
    aliases: [],
    usage: "<user> <message>",
    description: "Direct messages a user a message. Only certain people may use."
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
    let msgUserMentions = msg.mentions.users.array();
    let msgAttachments = msg.attachments.array();
    if (ops.includes(msg.author.id)) {
        if (msgUserMentions[0] !== undefined) {
            args.shift()
            if (msgAttachments[0] === undefined) {
                msgUserMentions[0].send(
                    args.join(" ")
                );
            }
            if (msgAttachments[0] !== undefined) {
                msgUserMentions[0].send(
                    args.join(" "),
                    { files: [msgAttachments[0].url] }
                );
            }
        }
        if (msgUserMentions[0] === undefined) {
            msg.channel.send("Please mention a user!");
        }
    } else {
        msg.channel.send(
            msg.member.displayName + ", you are not authorized to use this command."
        );
    }
}

module.exports = {
    command,
    info
}