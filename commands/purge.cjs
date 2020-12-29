const Discord = require("discord.js");
const fs = require('fs');
const info = {
    aliases: ["p"],
    usage: "[options]",
    description: "Deletes messages from a channel. Only certain people may use."
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
        msg.delete({ timeout: 500 })
        if (ops.includes(msg.author.id)) {
            if (Number(args[0]) <= 0 || isNaN(Number(args[0]))) {
                await msg.channel.send("Please enter a valid number.").then(m => { m.delete({ timeout: 2000 }) });
                return
            }
            let settings = {
                amount: Number(args[0]) >= 100 ? 100 : Number(args[0]),
                authors: [],
                authorids: [],
                other: [],
            }
            msg.mentions.users.each(u => {
                settings.authorids.push(u.id)
                settings.authors.push(`<@${u.id}>`)
            });
            args.filter(v => (!(v == 'dopins' || v == ('users') || v == ('bots')))).forEach(element => {
                if (client.users.cache.get(element)) {
                    settings.authorids.push(element)
                    settings.authors.push(`<@${element}>`)
                }
            });
            if (args.includes('dopins')) settings.other.push('Include Pins');
            if (args.includes('users')) settings.other.push('Users Only');
            if (args.includes('bots')) settings.other.push('Bots Only');
            if (!args.includes(`force`) && (settings.other.length > 0 || settings.authors.length > 0)) {
                let confirmembed = new Discord.MessageEmbed()
                    .setTitle("Confirmation")
                    .setColor(15105570)
                    .setTimestamp()
                    .setFooter(`Purge requested by ${msg.author.displayName}`)
                    .setDescription("Please review your settings to confirm purge.\nThis will timeout in 1 minute.")
                if (settings.other.length > 0) {
                    confirmembed.addField('Settings', settings.other)
                }
                if (settings.authors.length > 0) {
                    confirmembed.addField('Authors', settings.authors)
                }
                let confirmation = await msg.channel.send(confirmembed)
                confirmation.delete({ timeout: 60000 })
                await confirmation.react('✅')
                await confirmation.react('❌')
                let reactions = await confirmation.awaitReactions((r, user) => user.id == msg.author.id && (r.emoji.name == '✅' || r.emoji.name == '❌'), { time: 60000, max: 1 })
                await confirmation.delete({ timeout: 500 })
                if (reactions.some(reaction => reaction.emoji.name == '❌')) {
                    return
                }
            }
            let filterpurge = (m) => (
                (args.includes('dopins') ? true : (!m.pinned))
                && (args.includes('users') ? (!m.author.bot) : true)
                && (args.includes('bots') ? (m.author.bot) : true)
                && ((settings.authors.length > 0) ? (settings.authorids.includes(m.author.id)) : true))
            let messages = await msg.channel.messages.fetch({ limit: settings.amount }, false)
            let deleted = await msg.channel.bulkDelete(messages.filter(m => filterpurge(m)));
            let m = await msg.channel.send(
                `Deleted ${deleted.size} messages.`
            );
            m.delete({ timeout: 3000 });
        } else {
            msg.channel.send(
                msg.member.displayName + ", you are not authorized to use this command."
            );
        }
    } catch (err) {
        if (err) { client.channels.cache.get("720367748437508117").send("An error happened " + `at file ${err.fileName} at line ${err.lineNumber} at column ${err.columnNumber}` + "!\n```\n" + err.toString() + "\n```") };
    }
}

module.exports = {
    command,
    info
}