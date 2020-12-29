const Discord = require("discord.js");
const fs = require('fs');
const info = {
    aliases: [],
    usage: "",
    description: "Have the bot send you all the data under your user ID."
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
    delete require.cache[require.resolve(`../customer_data/${msg.author.id}.json`)];
    let customerdata = require(`../customer_data/${msg.author.id}.json`)
    msg.author.send('Here is the data I have stored under your user id.\n```json\n' + JSON.stringify(customerdata, null, '\t') + '\n```');
    delete require.cache[require.resolve(`../customer_data/${msg.author.id}.json`)];
}

module.exports = {
    command,
    info
}