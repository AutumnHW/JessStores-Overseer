const Discord = require("discord.js");
const fs = require('fs');
//const prefix = "devfix";
const info = {
    aliases: ['ttt', 'tic', 'tac', 'toe', 'noughts', 'crosses', 'n&c'],
    usage: "",
    description: "Play tic-tac-toe with a bot.",
    hidden: false
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
} = require("../functions.cjs");

const command = async (client, msg, args, ops, processors) => {
    function onerr(err) {
        if (err) { client.channels.cache.get("720367748437508117").send("An error happened " + `at file ${err.fileName} at line ${err.lineNumber} at column ${err.columnNumber}` + "!\n```\n" + err.toString() + "\n```") };
    }
    try {
        msg.delete({ timeout: 500 })
        var emojis = {
            x: '❌',
            o: '⭕',
            '*': '*️⃣',
            empty: ['⬛', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'],
        }
        let values = ['*',
            1, 2, 3,
            4, 5, 6,
            7, 8, 9
        ]
        let moves = []
        function emojify(value) {
            if (typeof value === 'number') {
                return emojis.empty[value];
            } else if (typeof value === 'string') {
                return emojis[value];
            }
        }
        function ticboard(vs) {
            return `${emojify(vs[1])}${emojify(vs[2])}${emojify(vs[3])}\n${emojify(vs[4])}${emojify(vs[5])}${emojify(vs[6])}\n${emojify(vs[7])}${emojify(vs[8])}${emojify(vs[9])}`;
        }
        function checkboard(ev, b) {
            let checktile = (t) => {
                return [typeof b[t] === 'number', b[t]];
            }
            //check horizontals
            if (checktile(1)[1] === checktile(2)[1] && checktile(2)[1] === checktile(3)[1]) {
                if (checktile(2)[1] == ev) return 'lose';
                if (checktile(2)[1] != ev) return 'win';
            }
            if (checktile(4)[1] === checktile(5)[1] && checktile(5)[1] === checktile(6)[1]) {
                if (checktile(5)[1] == ev) return 'lose';
                if (checktile(5)[1] != ev) return 'win';
            }
            if (checktile(7)[1] === checktile(8)[1] && checktile(8)[1] === checktile(9)[1]) {
                if (checktile(8)[1] == ev) return 'lose';
                if (checktile(8)[1] != ev) return 'win';
            }
            //check verticals
            if (checktile(1)[1] === checktile(4)[1] && checktile(4)[1] === checktile(7)[1]) {
                if (checktile(4)[1] == ev) return 'lose';
                if (checktile(4)[1] != ev) return 'win';
            }
            if (checktile(2)[1] === checktile(5)[1] && checktile(5)[1] === checktile(8)[1]) {
                if (checktile(5)[1] == ev) return 'lose';
                if (checktile(5)[1] != ev) return 'win';
            }
            if (checktile(3)[1] === checktile(6)[1] && checktile(6)[1] === checktile(9)[1]) {
                if (checktile(6)[1] == ev) return 'lose';
                if (checktile(6)[1] != ev) return 'win';
            }
            //check diagonals
            if (checktile(1)[1] === checktile(5)[1] && checktile(5)[1] === checktile(9)[1]) {
                if (checktile(5)[1] == ev) return 'lose';
                if (checktile(5)[1] != ev) return 'win';
            }
            if (checktile(3)[1] === checktile(5)[1] && checktile(5)[1] === checktile(7)[1]) {
                if (checktile(5)[1] == ev) return 'lose';
                if (checktile(5)[1] != ev) return 'win';
            }
            if (b.every(v => typeof v == 'string')) return 'draw';
        }
        function makemove(ev, lm, b) {
            let checktile = (t) => {
                return [typeof b[t] === 'number', b[t]];
            }
            if (checktile(5)[1] != ev && !checktile(5)[0]) {
                //3&7
                if (checktile(3)[1] != ev && (!checktile(3)[0]) && checktile(7)[0]) return 7;
                if (checktile(7)[1] != ev && (!checktile(7)[0]) && checktile(3)[0]) return 3;
                //1&9
                if (checktile(9)[1] != ev && (!checktile(9)[0]) && checktile(1)[0]) return 1;
                if (checktile(1)[1] != ev && (!checktile(1)[0]) && checktile(9)[0]) return 9;
                //2&8
                if (checktile(8)[1] != ev && (!checktile(8)[0]) && checktile(2)[0]) return 2;
                if (checktile(2)[1] != ev && (!checktile(2)[0]) && checktile(8)[0]) return 8;
                //4&6
                if (checktile(4)[1] != ev && (!checktile(4)[0]) && checktile(6)[0]) return 6;
                if (checktile(6)[1] != ev && (!checktile(6)[0]) && checktile(4)[0]) return 4;
            }
            if (checktile(1)[1] != ev && !checktile(1)[0]) {
                //2&3
                if (checktile(2)[1] != ev && (!checktile(2)[0]) && checktile(3)[0]) return 3;
                if (checktile(3)[1] != ev && (!checktile(3)[0]) && checktile(2)[0]) return 2;
                //4&7
                if (checktile(7)[1] != ev && (!checktile(7)[0]) && checktile(4)[0]) return 4;
                if (checktile(4)[1] != ev && (!checktile(4)[0]) && checktile(7)[0]) return 7;
                //9
                if (checktile(5)[1] != ev && (!checktile(5)[0]) && checktile(9)[0]) return 9;
            }
            if (checktile(3)[1] != ev && !checktile(3)[0]) {
                //1&2
                if (checktile(2)[1] != ev && (!checktile(2)[0]) && checktile(1)[0]) return 1;
                if (checktile(1)[1] != ev && (!checktile(1)[0]) && checktile(2)[0]) return 2;
                //6&9
                if (checktile(9)[1] != ev && (!checktile(9)[0]) && checktile(9)[0]) return 9;
                if (checktile(6)[1] != ev && (!checktile(6)[0]) && checktile(9)[0]) return 9;
                //7
                if (checktile(5)[1] != ev && (!checktile(5)[0]) && checktile(7)[0]) return 7;
            }
            if (checktile(7)[1] != ev && !checktile(7)[0]) {
                //1&4
                if (checktile(4)[1] != ev && (!checktile(4)[0]) && checktile(1)[0]) return 1;
                if (checktile(1)[1] != ev && (!checktile(1)[0]) && checktile(4)[0]) return 4;
                //8&9
                if (checktile(9)[1] != ev && (!checktile(9)[0]) && checktile(8)[0]) return 8;
                if (checktile(8)[1] != ev && (!checktile(8)[0]) && checktile(9)[0]) return 9;
                //3
                if (checktile(5)[1] != ev && (!checktile(5)[0]) && checktile(3)[0]) return 3;
            }
            if (checktile(9)[1] != ev && !checktile(9)[0]) {
                //7&8
                if (checktile(8)[1] != ev && (!checktile(8)[0]) && checktile(7)[0]) return 7;
                if (checktile(7)[1] != ev && (!checktile(7)[0]) && checktile(8)[0]) return 8;
                //3&6
                if (checktile(3)[1] != ev && (!checktile(3)[0]) && checktile(6)[0]) return 6;
                if (checktile(6)[1] != ev && (!checktile(6)[0]) && checktile(3)[0]) return 3;
                //1
                if (checktile(5)[1] != ev && (!checktile(5)[0]) && checktile(1)[0]) return 1;
            }
            if (checktile(5)[1] != ev && !checktile(5)[0]) {
                //3&7
                if (checktile(7)[1] != ev && (!checktile(7)[0]) && checktile(3)[0]) return 3;
                if (checktile(3)[1] != ev && (!checktile(3)[0]) && checktile(7)[0]) return 7;
                //1&9
                if (checktile(1)[1] != ev && (!checktile(1)[0]) && checktile(9)[0]) return 9;
                if (checktile(9)[1] != ev && (!checktile(9)[0]) && checktile(1)[0]) return 1;
                //2&8
                if (checktile(2)[1] != ev && (!checktile(2)[0]) && checktile(8)[0]) return 8;
                if (checktile(8)[1] != ev && (!checktile(8)[0]) && checktile(2)[0]) return 2;
                //6&4
                if (checktile(4)[1] != ev && (!checktile(4)[0]) && checktile(6)[0]) return 6;
                if (checktile(6)[1] != ev && (!checktile(6)[0]) && checktile(4)[0]) return 4;
            }
            if (checktile(5)[0]) {
                return 5;
            }
            if (checktile(1)[1] == ev) {
                //2&3
                if (checktile(2)[1] == ev && checktile(3)[0]) return 3;
                if (checktile(3)[1] == ev && checktile(2)[0]) return 2;
                //4&7
                if (checktile(7)[1] == ev && checktile(4)[0]) return 4;
                if (checktile(4)[1] == ev && checktile(7)[0]) return 7;
                //9
                if (checktile(5)[1] == ev && checktile(9)[0]) return 9;
                if (checktile(6)[1] == ev && checktile(9)[0]) return 9;
                if (checktile(8)[1] == ev && checktile(9)[0]) return 9;
            }
            if (checktile(3)[1] == ev) {
                //1&2
                if (checktile(2)[1] == ev && checktile(1)[0]) return 1;
                if (checktile(1)[1] == ev && checktile(2)[0]) return 2;
                //6&9
                if (checktile(9)[1] == ev && checktile(6)[0]) return 6;
                if (checktile(6)[1] == ev && checktile(9)[0]) return 9;
                //7
                if (checktile(5)[1] == ev && checktile(7)[0]) return 7;
                if (checktile(4)[1] == ev && checktile(7)[0]) return 7;
                if (checktile(8)[1] == ev && checktile(7)[0]) return 7;
            }
            if (checktile(7)[1] == ev) {
                //1&4
                if (checktile(4)[1] == ev && checktile(1)[0]) return 1;
                if (checktile(1)[1] == ev && checktile(4)[0]) return 4;
                //8&9
                if (checktile(9)[1] == ev && checktile(8)[0]) return 8;
                if (checktile(8)[1] == ev && checktile(9)[0]) return 9;
                //3
                if (checktile(5)[1] == ev && checktile(3)[0]) return 3;
                if (checktile(2)[1] == ev && checktile(3)[0]) return 3;
                if (checktile(6)[1] == ev && checktile(3)[0]) return 3;
            }
            if (checktile(9)[1] == ev) {
                //7&8
                if (checktile(8)[1] == ev && checktile(7)[0]) return 7;
                if (checktile(7)[1] == ev && checktile(8)[0]) return 8;
                //3&6
                if (checktile(6)[1] == ev && checktile(3)[0]) return 3;
                if (checktile(3)[1] == ev && checktile(6)[0]) return 6;
                //1
                if (checktile(5)[1] == ev && checktile(1)[0]) return 1;
                if (checktile(2)[1] == ev && checktile(1)[0]) return 1;
                if (checktile(4)[1] == ev && checktile(1)[0]) return 1;
            }
            if (checktile(5)[1] == ev) {
                //3&7
                if (checktile(3)[1] == ev && checktile(7)[0]) return 7;
                if (checktile(7)[1] == ev && checktile(3)[0]) return 3;
                //1&9
                if (checktile(9)[1] == ev && checktile(1)[0]) return 1;
                if (checktile(1)[1] == ev && checktile(9)[0]) return 9;
                //2&8
                if (checktile(2)[1] == ev && checktile(8)[0]) return 8;
                if (checktile(8)[1] == ev && checktile(2)[0]) return 2;
                //4&6
                if (checktile(4)[1] == ev && checktile(6)[0]) return 6;
                if (checktile(6)[1] == ev && checktile(4)[0]) return 4;
            }
            if (checktile(2)[1] == ev) {
                if (checktile(4)[1] == ev && checktile(1)[0]) return 1;
                if (checktile(6)[1] == ev && checktile(3)[0]) return 3;
            }
            if (checktile(4)[1] == ev) {
                if (checktile(2)[1] == ev && checktile(1)[0]) return 1;
                if (checktile(8)[1] == ev && checktile(7)[0]) return 7;
            }
            if (checktile(6)[1] == ev) {
                if (checktile(8)[1] == ev && checktile(9)[0]) return 9;
                if (checktile(2)[1] == ev && checktile(3)[0]) return 3;
            }
            if (checktile(8)[1] == ev) {
                if (checktile(4)[1] == ev && checktile(7)[0]) return 7;
                if (checktile(6)[1] == ev && checktile(9)[0]) return 9;
            }
            if (!checktile(5)[0]) {
                if (checktile(5)[1] != ev) {
                    if ((checktile(1)[1] == ev && checktile(9)[1] == ev) ||
                        (checktile(3)[1] == ev && checktile(7)[1] == ev)) {
                        if (checktile(8)[0]) return 8;
                        if (checktile(2)[0]) return 2;
                        if (checktile(4)[0]) return 4;
                        if (checktile(6)[0]) return 6;
                    }
                }
                if (checktile(1)[0]) return 1;
                if (checktile(3)[0]) return 3;
                if (checktile(7)[0]) return 7;
                if (checktile(9)[0]) return 9;
            }
            if (checktile(1)[0]) return 1;
            if (checktile(2)[0]) return 2;
            if (checktile(3)[0]) return 3;
            if (checktile(4)[0]) return 4;
            if (checktile(5)[0]) return 5;
            if (checktile(6)[0]) return 6;
            if (checktile(7)[0]) return 7;
            if (checktile(8)[0]) return 8;
            if (checktile(9)[0]) return 9;
        }
        //Actually doing stuff.
        let ticembed = new Discord.MessageEmbed()
            .setTitle('Tic Tac Toe')
            .setTimestamp()
            .setFooter(`Bot vs. ${msg.author.username}`)
            .setDescription(`You are ${emojis.x} and the bot is ${emojis.o}.\nReact to this message with a number to move.\nPlease wait until all reactions have been added before reacting.`)
            .setColor(15105570)
        let board = await msg.channel.send(ticboard(values), ticembed);
        emojis.empty.forEach(emoji => {
            if (emoji != emojis.empty[0]) {
                board.react(emoji);
            }
        })
        let collector = board.createReactionCollector((reaction, user) => user.id == msg.author.id && emojis.empty.includes(reaction.emoji.name) && typeof values[emojis.empty.indexOf(reaction.emoji.name)] === 'number')
        let tm = setTimeout(() => {
            try {
                ticembed = new Discord.MessageEmbed(ticembed).setTitle(`Game Complete`).setDescription(`Game exceeded 5 minutes.`).setColor(0x87CEEB)
                moves.push(values.slice())
                values.forEach(v => {
                    if (typeof v === 'number') {
                        values[values.indexOf(v)] = 0;
                    }
                })
                board.edit(ticboard(values), ticembed)
                board.reactions.removeAll()
                collector.stop()
            } catch (err) {
                onerr(err)
            }
        }, 300000)
        collector.on('collect', (r) => {
            try {
                r.remove()
                let valueindex = emojis.empty.indexOf(r.emoji.name)
                if (values[valueindex] == 'o') return;
                values[valueindex] = 'x'
                let bs1 = checkboard('x', values)
                if (!bs1) {
                    var enemyvalueindex = makemove('x', valueindex, values)
                    values[enemyvalueindex] = 'o'
                    var bs = checkboard('x', values)
                } else {
                    var bs = bs1
                }
                if (!bs) {
                    moves.push(values.slice())
                    board.edit(ticboard(values), ticembed)
                    board.reactions.cache.get(emojis.empty[enemyvalueindex]).remove()
                } else {
                    clearTimeout(tm)
                    ticembed = new Discord.MessageEmbed(ticembed).setTitle(`Game Complete`).setDescription(`${bs == 'draw' ? `${emojis.x}${emojis.o} Draw` : bs == 'win' ? `${emojis.o} ${client.user.username} Wins` : `${emojis.x} ${msg.author.username} Wins`}!`).setColor(bs == 'draw' ? 0x87CEEB : bs == 'win' ? 0xFF0000 : 0x00FF00)
                    moves.push(values.slice())
                    values.forEach(v => {
                        if (typeof v === 'number') {
                            values[values.indexOf(v)] = 0;
                        }
                    })
                    board.edit(ticboard(values), ticembed)
                    board.reactions.removeAll()
                    collector.stop()
                }
            } catch (err) {
                onerr(err)
            }
        })
        collector.on('end', async (rs) => {
            try {
                clearTimeout(tm)
                if (board.deleted) return;
                let m = await msg.channel.send('Do you want a copy of every move made sent to your dms?')
                await m.react('✅')
                await m.react('❌')
                let reactions = await m.awaitReactions((r, user) => user.id == msg.author.id && (r.emoji.name == '✅' || r.emoji.name == '❌'), { max: 1, time: 45000 })
                m.delete({ timeout: 500 })
                if (reactions.size <= 0) return;
                let reaction = reactions.first()
                if (reaction.emoji.name == '❌') return;
                let movesg = [`__**Bot vs. ${msg.author.username}**__\nTic-Tac-Toe`]
                moves.forEach(move => {
                    move.forEach(v => {
                        if (typeof v === 'number') {
                            move[move.indexOf(v)] = 0;
                        }
                    })
                    movesg.push(`__Turn ${moves.indexOf(move) + 1}__\n${ticboard(move)}`);
                })
                await msg.author.send(movesg)
            } catch (err) {
                onerr(err)
            }
        })
    } catch (err) {
        onerr(err)
    }
}

module.exports = {
    command,
    //prefix,
    info
}