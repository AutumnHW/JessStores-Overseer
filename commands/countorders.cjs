const Discord = require("discord.js");
const fs = require('fs');
const info = {
    aliases: ["count"],
    usage: "",
    description: "Counts the orders and updates the counts. Only VPs may use."
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
    if (ops.includes(msg.author.id) || Object.keys(processors).includes(msg.author.id)) {
        let start = Date.now()
        let m = await msg.channel.send(`Counting...`)
        let orders = await countorder(client);
        let end = Date.now()
        await m.edit(`I counted ${orders.active} active orders, ${orders.processing} of which are awaiting processing, and ${orders.processed} of which have been processed. It took ${end - start}ms.`);
    } else {
        await msg.channel.send(msg.member.displayName + ", you are not authorized to use this command.");
    }
}

module.exports = {
    command,
    info
}