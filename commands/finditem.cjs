const Discord = require("discord.js");
const fs = require('fs');
const info = {
    aliases: ["itemfind", "find"],
    usage: "<item>",
    description: "Finds the price and keywords of an item."
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
    let item = args.join(" ");
    let typepricing = [];
    let keywords = [];
    let itemembed = new Discord.MessageEmbed().setTitle("Item Information")
        .setTimestamp()
        .setColor(15105570)
        .setFooter("Information requested by " + msg.author.username);
    if (finditem(item, "g") != null || finditem(item, "b") != null || finditem(item, "u") != null || finditem(item, "w") != null) {
        if (finditem(item, "w") != null) {
            let giftitem = finditem(item, "w")
            typepricing.push(`${giftitem.name} - $${numberWithCommas(giftitem.price)}`)
            keywords.push(giftitem.key)
        }
        if (finditem(item, "g") != null) {
            let giftitem = finditem(item, "g")
            typepricing.push(`${giftitem.name} - $${numberWithCommas(giftitem.price)}`)
            keywords.push(giftitem.key)
        }
        if (finditem(item, "b") != null) {
            let giftitem = finditem(item, "b")
            typepricing.push(`${giftitem.name} - $${numberWithCommas(giftitem.price)}`)
            keywords.push(giftitem.key)
        }
        if (finditem(item, "u") != null) {
            let giftitem = finditem(item, "u")
            typepricing.push(`${giftitem.name} - $${numberWithCommas(giftitem.price)}`)
            keywords.push(giftitem.key)
        }
        itemembed.addField("Key Words", keywords, true).addField("Item Data", typepricing, true);
        msg.channel.send(itemembed);
    } else {
        msg.channel.send("Item not found.").then(m => m.delete({ timeout: 2000, reason: "Clearing trash." }))
    }
}

module.exports = {
    command,
    info
}