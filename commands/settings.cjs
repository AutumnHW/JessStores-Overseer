const Discord = require("discord.js");
const fs = require('fs');
const info = {
    aliases: ["s"],
    usage: "[<setting> <value>]",
    description: "Used to view or change your settings."
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
    if (args.length == 2 && customerdata.settings[args[0]] != undefined) {
        customerdata.settings[args[0]] = args[1] == 'true' || args[1] == 't' || args[1] == 'yes'
        fs.writeFile(`./customer_data/${msg.author.id}.json`,
            JSON.stringify(customerdata, null, '\t'),
            err => { if (err) throw err; })
        msg.channel.send(`Setting ${args[0]} set to ${args[1] == 'true' ||
            args[1] == 't' ||
            args[1] == 'yes'}`)
    } else {
        let settingsembed = new Discord.MessageEmbed().setTitle("User Settings")
            .setTimestamp()
            .setColor(15105570)
            .setFooter("Information requested by " + msg.author.username);
        let settingsarray = [];
        Object.keys(customerdata.settings).forEach(key => {
            settingsarray.push(`${key} - ${customerdata.settings[key]}`)
        });
        settingsembed.addField("Settings", settingsarray);
        msg.channel.send(settingsembed);
    }
}

module.exports = {
    command,
    info
}