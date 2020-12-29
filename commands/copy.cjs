const Discord = require("discord.js");
const fs = require('fs');
const info = {
    aliases: [],
    usage: "<message>",
    description: "Have the bot say a message. Only certain people may use."
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
    let msgAttachments = msg.attachments.array();
    if (ops.includes(msg.author.id)) {
        if (msgAttachments[0] === undefined) {
            msg.channel.send(args.join(" "));
        }
        if (msgAttachments[0] !== undefined) {
            msg.channel.send(args.join(" "), {
                files: [msgAttachments[0].url]
            });
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