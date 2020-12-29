const Discord = require("discord.js");
const fs = require('fs');
const prefix = "devfix";
const info = {
    aliases: [],
    usage: "[options] [command]",
    description: "Used to get a list of commands."
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
        let cmdargs = args.filter(a => a != 'showhidden' && a != 'nocommands')
        delete require.cache[require.resolve('../storedata.json')];
        let storedata = require('../storedata.json')
        var helpembed = new Discord.MessageEmbed()
            .setColor(15105570)
            .setTitle('Command Help')
            .setFooter(`Requested by ${msg.author.tag}`)
            .setTimestamp()
            .setDescription((!args.includes('nocommands') ? 'Any argument(s) surrounded by `[]` are optional.\nAny argument surrounded by `<>` is required.\n' : '') + 'The prefix for commands is `' + storedata.prefix + '`.')
        if (!args.includes('nocommands')) {
            let cmds = fs.readdirSync(`./commands`)
            cmds.forEach(file => {
                if (!file.endsWith('.cjs')) return;
                delete require.cache[require.resolve(`./${file}`)];
                let commandname = file.slice(0, -4)
                if (!((cmds.some(c => cmdargs.includes(c.slice(0, -4))) && cmdargs.includes(commandname)) || cmdargs.length <= 0)) return;
                let command = require(`./${file}`);
                let info = command.info;
                if ((info.hidden == undefined || !info.hidden || !info.nevershow) || (ops.includes(msg.author.id) && args.includes('showhidden') && !info.nevershow)) {
                    helpembed.addField(`__${storedata.prefix}${file.slice(0, -4)} ${info.usage}__`,
                        `${info.aliases.length > 0 ? `${info.aliases.length > 1 ? `**Aliases:**` : `**Alias:**`} ${info.aliases.join(`, `)}\n` : ''}${info.description ? info.description : "No description."}`)
                }
            })
        }
        await msg.channel.send(helpembed);
    } catch (err) {
        if (err) { client.channels.cache.get("720367748437508117").send("An error happened " + `at file ${err.fileName} at line ${err.lineNumber} at column ${err.columnNumber}` + "!\n```\n" + err.toString() + "\n```") };
    }
}

module.exports = {
    command,
    prefix,
    info
}