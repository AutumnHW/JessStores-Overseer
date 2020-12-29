const Discord = require("discord.js");
const fs = require('fs');
const beautify = require('js-beautify').js;
const info = {
    aliases: [],
    usage: "<script>",
    description: "Highly dangerous command.\n**USE AT OWN RISK!!!**",
    hidden: true,
    nevershow: true
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
    if (!ops.includes(msg.author.id)) return;
    msg.delete({ reason: 'Deleting command.' })
    let embed = new Discord.MessageEmbed()
        .setTitle('Eval')
        .setTimestamp()
        .setFooter(`${msg.author.tag} (${msg.author.id})`)
    try {
        let start = process.hrtime()
        let output = await eval(`(async () => {${args.join(' ')}})()`)
        let time = process.hrtime(start)
        let timems = time[0] > 0 ? time[0] * 1000 : time[1] / 1000000;
        msg.channel.send(embed.setColor(3066993).setDescription(`**__Evaluated in:__** ${timems}ms!\n**__Script:__**${'```js'}\n${beautify(args.join(' '), {
            "indent_size": "1",
            "indent_char": "\t",
            "max_preserve_newlines": "-1",
            "preserve_newlines": false,
            "keep_array_indentation": true,
            "break_chained_methods": false,
            "indent_scripts": "normal",
            "brace_style": "collapse,preserve-inline",
            "space_before_conditional": true,
            "unescape_strings": true,
            "jslint_happy": false,
            "end_with_newline": false,
            "wrap_line_length": "0",
            "indent_inner_html": false,
            "comma_first": false,
            "e4x": false,
            "indent_empty_lines": false
        })}\n${'```'}${output ? `** __Output: __ ** ${'```js'}\n${output}\n${'```'}` : ''}`))
    } catch (err) {
        msg.channel.send(embed.setColor(15158332).setDescription(`**__Error!__**\n** __Script: __ **${'```js'}\n${beautify(args.join(' '), {
            "indent_size": "1",
            "indent_char": "\t",
            "max_preserve_newlines": "-1",
            "preserve_newlines": false,
            "keep_array_indentation": true,
            "break_chained_methods": false,
            "indent_scripts": "normal",
            "brace_style": "collapse,preserve-inline",
            "space_before_conditional": true,
            "unescape_strings": true,
            "jslint_happy": false,
            "end_with_newline": false,
            "wrap_line_length": "0",
            "indent_inner_html": false,
            "comma_first": false,
            "e4x": false,
            "indent_empty_lines": false
        })}\n${'```'}**__${err.name}:__**${'```'}\n${err.message}\n${'```'}`))
    }
}

module.exports = {
    command,
    info
}