const Discord = require("discord.js");
const fs = require('fs');
const info = {
    aliases: [],
    usage: "",
    description: "Enigma machine. Only gay boys may know what it says.",
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
    try {
        //Alphabet for control
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const rotors = {
            //Commercial AB
            ic: "DMTWSILRUYQNKFEJCAZBPGXOHV",
            iic: "HQZGPJTMOBLNCIFDYAWVEUSRKX",
            iiic: "UQNTLSZFMREHDPXKIBVYGJCWOA",
            //Railway
            //Swiss K
            /*ik: "PEZUOHXSCVFMTBGLRINQJWAYDK",
            iik: "ZOUESYDKFWPCIQXHMVBLGNJRAT",
            iiik: "EHRVXGAOBQUSIMZFLYNWKTPDJC",*/
            //Enigma 1
            i: "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
            ii: "AJDKSIRUXBLHWTMCQGZNPYFVOE",
            iii: "BDFHJLCPRTXVZNYEIWGAKMUSQO",
            //M3 Army
            iv: "ESOVPZJAYQUIRHXLNFTGKDCMWB",
            v: "VZBRGITYUPSDNHLXAWMJQOFECK",
            //M3 & M4 Naval
            vi: "JPGVOUMFYQBENHZRDKASXLICTW",
            vii: "NZJHGRCXMYSWBOUFAIVLPEKQDT",
            viii: "FKQHTLXOCBJSPDZRAMEWNIUYGV"
        }
        const reflectors = {
            beta: "LEYJVCNIXWPBQMDRTAKZGFUHOS",
            gamma: "FSOKANUERHMBTIYCWLQPZXVGJD",
            a: "EJMZALYXVBWFCRQUONTSPIKHGD",
            b: "YRUHQSLDPXNGOKMIEBFZCWVJAT",
            c: "FVPJIAOYEDRZXWGCTKUQSBNMHL",
            bthin: "ENKQAUYWJICOPBLMDXZVFTHRGS",
            cthin: "RDOBJNTKVEHMLFCWZAXGYIPSUQ",
            //etwk: "QWERTZUIOASDFGHJKPYXCVBNML",
            ukw: "QYHOGNECVPUZTFDJAXWMKISRBL",
            //utwk: "IMETCGFRAYSQBZXWLHKDVUPOJN"
        }
        let embedtemplate = new Discord.MessageEmbed()
            .setTitle("Enigma Machine")
            .setFooter(`${msg.author.username}`)
            .setTimestamp()
            .setColor(15105570)
        function userotor(letter, rotor = alphabet, rotorposition = 0, reverse = false, ab = alphabet) {
            let abarray = ab.split("");
            let chars = rotor.split("");
            let index = abarray.findIndex(letter.toUpperCase());
            if (index >= 0) {
                if (!reverse) {
                    var newindex = chars[index + rotorposition];
                    while (newindex > rotor.length) {
                        newindex -= rotor.length;
                    }
                } else {
                    var newindex = chars[index - rotorposition];
                    while (newindex < rotor.length) {
                        newindex += rotor.length;
                    }
                }
                if (letter.toLowerCase() === letter) {
                    return chars[newindex].toLowerCase();
                } else {
                    return chars[newindex];
                }
            } else if (letter === `_`) {
                return " ";
            } else {
                return letter;
            }
        }
        let selectedrotors = [`i`, `ii`, `iii`];
        let selectedreflector = 'ukw';
        let originalmessage = [];
        let message = [];
        //let enigmamessage = await msg.channel.send(new Discord.MessageEmbed(embedtemplate).addField(`Rotors`, `${selectedrotors.join(` | `).toUpperCase()}`, true).addField(`Reflector`, `${selectedreflector.toUpperCase()}`, true).addField(`Original Message`, `${originalmessage.join('')}`).addField(`Encoded Message`, `${message.join('')}`));
        let enigmamessage = await msg.channel.send(new Discord.MessageEmbed(embedtemplate).addField(`Rotors`, `${selectedrotors.join(` | `).toUpperCase()}`, true).addField(`Reflector`, `${selectedreflector.toUpperCase()}`, true).addField(`Original Message`, `No message entered.`));
        let keypresscollector = msg.channel.createMessageCollector();
        keypresscollector.on('collect', (m) => {
            if (m.content.length == 1) {
                originalmessage.push(m.content);
            } else {
                let cargs = m.content.trim().split(/ +/g);
                switch (cargs.shift()) {
                    case `end`:
                        m.delete({ timeout: 1000 });
                        keypresscollector.stop();
                        break;
                    case `rotor`:
                        if (cargs[1] == `list`) {
                            return;
                        } else if (Number(cargs[1]) > selectedrotors.length) {
                            return;
                        } else {
                            return;
                        }
                        break;
                }
            }
        });
        keypresscollector.stop();
    } catch (err) {
        if (err) { client.channels.cache.get("720367748437508117").send("An error happened " + `at file ${err.fileName} at line ${err.lineNumber} at column ${err.columnNumber}` + "!\n```\n" + err.toString() + "\n```") };
    }
}

module.exports = {
    command,
    info
}