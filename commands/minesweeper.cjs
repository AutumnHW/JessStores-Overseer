const Discord = require("discord.js");
const fs = require('fs');
//const prefix = "devfix";
const info = {
    aliases: ['mws'],
    usage: "[% of mines; 15% default]",
    description: "Play minesweeper. You won't win anything this time...",
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
const { moveCursor } = require("readline");

const command = async (client, msg, args, ops, processors) => {
    let gamemsg = await msg.channel.send(`Generating game...`)
    //Constants...
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    const xv = alphabet;
    const yv = alphabet;
    const embedtemplate = new Discord.MessageEmbed()
        .setTitle('Minesweeper')
        .setFooter(`${msg.author.username}'s Game`)
        .setTimestamp()
        .setColor(15105570)
    //Get mines function...
    function genMines(arr, p = 15) {
        let n = Math.ceil(arr.length * (p / 100))
        if (n <= 0) { n = 1 }
        if (n >= arr.length) { n = arr.length - 1 }
        var result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    }
    async function genBoardCoords(xv = alphabet, yv = alphabet, w = 8, h = 8) {
        let board = [];
        //Loops over every Y value
        for (let y = 0; y < w && y < yv.length; y++) {
            //Adds a new array for every Y value
            board.push([]);
            //loops over every X value
            for (let x = 0; x < h && x < xv.length; x++) {
                //Adds the coordinates onto the y's array
                board[y].push(`${xv[x]}${yv[y]}`)
            }
        }
        return board;
    }
    function genBoardVisual(b, bspobj, xv = alphabet, yv = alphabet) {
        const emojis = {
            bomb: '💣',
            mark: '🚩',
            wrongmark: '☠️',
            undiscovered: '🔲',
            empty: '⬜',
            coords: 'regional_indicator_',
            numbers: ''
        }
        //Generate board with emojis...
        //Assumes 1st level arrays are rows...
        //Initiates board variable and adds the corner emoji...
        var board = `↘️`
        //Loops over column values and adds them...
        for (let x = 0; x < b.length; x++) {
            board = board.concat(` :${emojis.coords}${xv[x]}:`)
        }
        //Loops over every row and adds coordinate values...
        b.forEach((row, y) => {
            board = board.concat(`\n:${emojis.coords}${yv[y]}:​`)
            //Loops over every column to add board...
            row.forEach((value, x) => {
                //Checks values to add correct emoji...
                if (bspobj.flagged.includes(value)) {
                    if (bspobj.gameend && !bspobj.mines.includes(value)) {
                        board = board.concat(` ${emojis.wrongmark}`)
                    } else {
                        board = board.concat(` ${emojis.mark}`)
                    }
                } else if (bspobj.gameend && bspobj.mines.includes(value)) {
                    board = board.concat(` ${emojis.bomb}`)
                } else if (!bspobj.gameend && !bspobj.discovered.includes(value)) {
                    board = board.concat(` ${emojis.undiscovered}`)
                } else if (bspobj.eight.includes(value)) {
                    board = board.concat(` :eight:`)
                } else if (bspobj.seven.includes(value)) {
                    board = board.concat(` :seven:`)
                } else if (bspobj.six.includes(value)) {
                    board = board.concat(` :six:`)
                } else if (bspobj.five.includes(value)) {
                    board = board.concat(` :five:`)
                } else if (bspobj.four.includes(value)) {
                    board = board.concat(` :four:`)
                } else if (bspobj.three.includes(value)) {
                    board = board.concat(` :three:`)
                } else if (bspobj.two.includes(value)) {
                    board = board.concat(` :two:`)
                } else if (bspobj.one.includes(value)) {
                    board = board.concat(` :one:`)
                } else {
                    board = board.concat(` ${emojis.empty}`)
                }
            })
        })
        return board;
    }
    //Board arrays...
    let coords = await genBoardCoords(alphabet, alphabet);//, args[0], args[1]);
    //msg.channel.send(coords)
    let board = {
        discovered: [],
        mines: genMines(coords.flat(), (args[0] && !isNaN(Number(args[0])) ? (Number(args[0])) : undefined)),
        one: [],
        two: [],
        three: [],
        four: [],
        five: [],
        six: [],
        seven: [],
        eight: [],
        empty: [],
        flagged: [],
        gameend: false
    }
    //Checks the 8 tiles around every tile for bombs...
    coords.forEach((row, y) => {
        row.forEach((value, x) => {
            if (!board.mines.includes(value)) {
                let minenum = 0;
                let aboverow = coords[y + 1];
                let belowrow = coords[y - 1];
                if (board.mines.includes(row[x - 1])) minenum++;
                if (board.mines.includes(row[x + 1])) minenum++;
                if (aboverow) {
                    if (board.mines.includes(aboverow[x])) minenum++;
                    if (board.mines.includes(aboverow[x + 1])) minenum++;
                    if (board.mines.includes(aboverow[x - 1])) minenum++;
                }
                if (belowrow) {
                    if (board.mines.includes(belowrow[x])) minenum++;
                    if (board.mines.includes(belowrow[x + 1])) minenum++;
                    if (board.mines.includes(belowrow[x - 1])) minenum++;
                }
                if (minenum <= 0) board.empty.push(value);
                if (minenum == 8) board.eight.push(value);
                if (minenum == 7) board.seven.push(value);
                if (minenum == 6) board.six.push(value);
                if (minenum == 5) board.five.push(value);
                if (minenum == 4) board.four.push(value);
                if (minenum == 3) board.three.push(value);
                if (minenum == 2) board.two.push(value);
                if (minenum == 1) board.one.push(value);
            } else {
                return;
            }
        });
    });
    await gamemsg.edit(genBoardVisual(coords, board), new Discord.MessageEmbed(embedtemplate).setDescription('Guess by doing `<xy of a tile> [action]`.\nPossible actions include `guess `(default), `flag`, `unflag`, and `reveal` (opens up any unflagged spaces around tile).\nType `end` if you wish to end the game and reveal all tiles.').addField('Flags', `${board.flagged.length}/${board.mines.length}`));
    let movecollector = gamemsg.channel.createMessageCollector((m) => m.author.id == msg.author.id)
    movecollector.on('collect', (move) => {
        let actions = [`guess`, `reveal`, `flag`, `unflag`]
        let embed = new Discord.MessageEmbed(embedtemplate).setDescription('Guess by doing `<xy of a tile> [action]`.\nPossible actions include `guess `(default), `flag`, `unflag`, and `reveal` (opens up any unflagged spaces around tile).\nType `end` if you wish to end the game and reveal all tiles')
        let movedata = move.content.toLowerCase().trim().split(/ +/g);
        let value = movedata[0]
        let action = (movedata[1] ? movedata[1] : 'guess')
        if (!actions.includes(action)) return;
        if (!coords.flat().includes(value) && value != 'end') return;
        move.delete({ timeout: 500, reason: 'Deleting move.' })
        if (value == 'end') {
            //What to do if the end...
            board.gameend = true;
            movecollector.stop()
            embed.setDescription(`Game Ended!`)
        } else if (action == 'flag') {
            //What to do if someone flags...
            if (board.flagged.includes(value)) return;
            if (board.flagged.length >= board.mines.length) return;
            if (board.discovered.includes(value)) return;
            board.flagged.push(value)
            embed.addField('Flags', `${board.flagged.length}/${board.mines.length}`)
        } else if (action == 'unflag') {
            //What to do if someone unflags...
            if (!board.flagged.includes(value)) return;
            board.flagged.splice(board.flagged.indexOf(value), 1)
            embed.addField('Flags', `${board.flagged.length}/${board.mines.length}`)
        } else if (action == 'reveal') {
            //Like the left+right click in real game...
            embed.addField('Flags', `${board.flagged.length}/${board.mines.length}`)
            if (!board.discovered.includes(value)) return;
            var y = -1
            for (var rowt of coords) {
                y++
                if (rowt.includes(value)) {
                    var x = rowt.indexOf(value)
                    var row = rowt
                    break
                }
            }
            let aboverow = coords[y + 1];
            let belowrow = coords[y - 1];
            //console.log(x)
            if (!board.flagged.includes(row[x - 1]) && !board.discovered.includes(row[x - 1])) board.discovered.push(row[x - 1]);
            if (!board.flagged.includes(row[x + 1]) && !board.discovered.includes(row[x + 1])) board.discovered.push(row[x + 1]);
            if (aboverow) {
                if (!board.flagged.includes(aboverow[x]) && !board.discovered.includes(aboverow[x])) board.discovered.push(aboverow[x]);
                if (!board.flagged.includes(aboverow[x + 1]) && !board.discovered.includes(aboverow[x + 1])) board.discovered.push(aboverow[x + 1]);
                if (!board.flagged.includes(aboverow[x - 1]) && !board.discovered.includes(aboverow[x - 1])) board.discovered.push(aboverow[x - 1]);
            }
            if (belowrow) {
                if (!board.flagged.includes(belowrow[x]) && !board.discovered.includes(belowrow[x])) board.discovered.push(belowrow[x]);
                if (!board.flagged.includes(belowrow[x + 1]) && !board.discovered.includes(belowrow[x + 1])) board.discovered.push(belowrow[x + 1]);
                if (!board.flagged.includes(belowrow[x - 1]) && !board.discovered.includes(belowrow[x - 1])) board.discovered.push(belowrow[x - 1]);
            }
            do {
                board.empty.forEach((v, i) => {
                    if (!board.discovered.includes(v)) return;
                    var y = -1
                    for (var rowt of coords) {
                        y++
                        if (rowt.includes(v)) {
                            var x = rowt.indexOf(v)
                            var row = rowt
                            break
                        }
                    }
                    let aboverow = coords[y + 1];
                    let belowrow = coords[y - 1];
                    //console.log(x)
                    if (!board.discovered.includes(row[x - 1])) board.discovered.push(row[x - 1]);
                    if (!board.discovered.includes(row[x + 1])) board.discovered.push(row[x + 1]);
                    if (aboverow) {
                        if (!board.discovered.includes(aboverow[x])) board.discovered.push(aboverow[x]);
                        if (!board.discovered.includes(aboverow[x + 1])) board.discovered.push(aboverow[x + 1]);
                        if (!board.discovered.includes(aboverow[x - 1])) board.discovered.push(aboverow[x - 1]);
                    }
                    if (belowrow) {
                        if (!board.discovered.includes(belowrow[x])) board.discovered.push(belowrow[x]);
                        if (!board.discovered.includes(belowrow[x + 1])) board.discovered.push(belowrow[x + 1]);
                        if (!board.discovered.includes(belowrow[x - 1])) board.discovered.push(belowrow[x - 1]);
                    }
                })
            } while (board.empty.some((v) => {
                //Do the same as the do statement except this time you're returning a value so that you can go do the do statement.
                if (!board.discovered.includes(v)) return false;
                var y = -1
                for (var rowt of coords) {
                    y++
                    if (rowt.includes(v)) {
                        var x = rowt.indexOf(v)
                        var row = rowt
                        break
                    }
                }
                let aboverow = coords[y + 1];
                let belowrow = coords[y - 1];
                //console.log(x)
                if (!board.discovered.includes(row[x - 1])) return true;
                if (!board.discovered.includes(row[x + 1])) return true;
                if (aboverow) {
                    if (!board.discovered.includes(aboverow[x])) return true;
                    if (!board.discovered.includes(aboverow[x + 1])) return true;
                    if (!board.discovered.includes(aboverow[x - 1])) return true;
                }
                if (belowrow) {
                    if (!board.discovered.includes(belowrow[x])) return true;
                    if (!board.discovered.includes(belowrow[x + 1])) return true;
                    if (!board.discovered.includes(belowrow[x - 1])) return true;
                }
                return false;

            }));
        } else if (action == 'guess') {
            //Default/guess
            if (board.discovered.includes(value)) return;
            if (board.mines.includes(value)) {
                board.gameend = true;
                movecollector.stop()
                embed.setDescription(`Game Lost!`).setColor(15158332)
            } else if (board.empty.includes(value)) {
                board.discovered.push(value)
                embed.addField('Flags', `${board.flagged.length}/${board.mines.length}`)
                do {
                    board.empty.forEach((v, i) => {
                        if (!board.discovered.includes(v)) return;
                        var y = -1
                        for (var rowt of coords) {
                            y++
                            if (rowt.includes(v)) {
                                var x = rowt.indexOf(v)
                                var row = rowt
                                break
                            }
                        }
                        let aboverow = coords[y + 1];
                        let belowrow = coords[y - 1];
                        //console.log(x)
                        if (!board.discovered.includes(row[x - 1])) board.discovered.push(row[x - 1]);
                        if (!board.discovered.includes(row[x + 1])) board.discovered.push(row[x + 1]);
                        if (aboverow) {
                            if (!board.discovered.includes(aboverow[x])) board.discovered.push(aboverow[x]);
                            if (!board.discovered.includes(aboverow[x + 1])) board.discovered.push(aboverow[x + 1]);
                            if (!board.discovered.includes(aboverow[x - 1])) board.discovered.push(aboverow[x - 1]);
                        }
                        if (belowrow) {
                            if (!board.discovered.includes(belowrow[x])) board.discovered.push(belowrow[x]);
                            if (!board.discovered.includes(belowrow[x + 1])) board.discovered.push(belowrow[x + 1]);
                            if (!board.discovered.includes(belowrow[x - 1])) board.discovered.push(belowrow[x - 1]);
                        }
                    })
                } while (board.empty.some((v) => {
                    //Do the same as the do statement except this time you're returning a value so that you can go do the do statement.
                    if (!board.discovered.includes(v)) return false;
                    var y = -1
                    for (var rowt of coords) {
                        y++
                        if (rowt.includes(v)) {
                            var x = rowt.indexOf(v)
                            var row = rowt
                            break
                        }
                    }
                    let aboverow = coords[y + 1];
                    let belowrow = coords[y - 1];
                    //console.log(x)
                    if (!board.discovered.includes(row[x - 1])) return true;
                    if (!board.discovered.includes(row[x + 1])) return true;
                    if (aboverow) {
                        if (!board.discovered.includes(aboverow[x])) return true;
                        if (!board.discovered.includes(aboverow[x + 1])) return true;
                        if (!board.discovered.includes(aboverow[x - 1])) return true;
                    }
                    if (belowrow) {
                        if (!board.discovered.includes(belowrow[x])) return true;
                        if (!board.discovered.includes(belowrow[x + 1])) return true;
                        if (!board.discovered.includes(belowrow[x - 1])) return true;
                    }
                    return false;

                }));
            } else {
                board.discovered.push(value)
                embed.addField('Flags', `${board.flagged.length}/${board.mines.length}`)
            }
        }
        //Losing...
        if (board.discovered.some(v => board.mines.includes(v))) {
            board.gameend = true;
            movecollector.stop()
            embed.setDescription(`Game Lost!`).setColor(15158332)
        }
        //When someone wins...
        if (board.flagged.every((v) => board.mines.includes(v)) && board.flagged.length == board.mines.length) {
            board.gameend = true;
            movecollector.stop()
            embed.setDescription(`Game Won!`).setColor(3066993)
        }
        gamemsg.edit(genBoardVisual(coords, board), embed);
    });
}

module.exports = {
    command,
    //prefix,
    info
}