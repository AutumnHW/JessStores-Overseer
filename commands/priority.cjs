const Discord = require("discord.js");
const fs = require('fs');
const info = {
    aliases: [],
    usage: "<type (perm/regular/pending)> <action (add/remove)> <user id(s)>",
    description: "Add or remove priority.",
    hidden: true,
    nevershow: false
}

const customerdatapath = `./customer_data`;

const roles = {
    perm: `664825709310640142`,
    regular: `664034568671854593`,
    pending: `665945415094501386`
};

const filterDuplicates = (array) => array.filter((v, i) => array.indexOf(v) === i);

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
    if (!ops.includes(msg.author.id)) return msg.channel.send(`Piss off cunt`);
    try {
        let argset = filterDuplicates(args);
        let type = await argset.shift();
        let action = await argset.shift();
        switch (type) {
            case `perm`:
                for (let i = 0; i < argset.length; i++) {
                    delete require.cache[require.resolve(`.${customerdatapath}/${argset[i]}.json`)];
                    let customerobject = require(`.${customerdatapath}/${argset[i]}.json`);
                    let customermember = client.guilds.cache.get(`663986068659503105`).members.cache.get(`${argset[i]}`);
                    switch (action) {
                        case `add`:
                            if (customermember) {
                                customermember.roles.add(roles.perm);
                            };
                            customerobject.priority.perm = true;
                            customerobject.priority.has = true;
                            break;
                        case `remove`:
                            if (customermember) {
                                customermember.roles.remove(roles.perm);
                            };
                            customerobject.priority.perm = false;
                            customerobject.priority.has = false;
                            break;
                        default:
                            throw new TypeError(`"${action}" is not a valid action.`)
                    };
                    fs.writeFileSync(`${customerdatapath}/${argset[i]}.json`, JSON.stringify(customerobject, null, '\t'));
                };
                break;
            case `regular`:
                for (let i = 0; i < argset.length; i++) {
                    delete require.cache[require.resolve(`.${customerdatapath}/${argset[i]}.json`)];
                    let customerobject = require(`.${customerdatapath}/${argset[i]}.json`);
                    let customermember = client.guilds.cache.get(`663986068659503105`).members.cache.get(`${argset[i]}`);
                    switch (action) {
                        case `add`:
                            if (customermember) {
                                customermember.roles.add(roles.regular);
                            };
                            customerobject.priority.has = true;
                            customerobject.priority.perm = true;
                            break;
                        case `remove`:
                            if (customermember) {
                                customermember.roles.remove(roles.regular);
                            };
                            customerobject.priority.has = false;
                            customerobject.priority.perm = false;
                            break;
                        default:
                            throw new TypeError(`"${action}" is not a valid action.`)
                    };
                    fs.writeFileSync(`${customerdatapath}/${argset[i]}.json`, JSON.stringify(customerobject, null, '\t'));
                };
                break;
            case `pending`:
                for (let i = 0; i < argset.length; i++) {
                    delete require.cache[require.resolve(`.${customerdatapath}/${argset[i]}.json`)];
                    let customerobject = require(`.${customerdatapath}/${argset[i]}.json`);
                    let customermember = client.guilds.cache.get(`663986068659503105`).members.cache.get(`${argset[i]}`);
                    switch (action) {
                        case `add`:
                            if (customermember) {
                                customermember.roles.add(roles.pending);
                            };
                            customerobject.priority.pending = true;
                            break;
                        case `remove`:
                            if (customermember) {
                                customermember.roles.remove(roles.pending);
                            };
                            customerobject.priority.pending = false;
                            break;
                        default:
                            throw new TypeError(`"${action}" is not a valid action.`)
                    };
                    fs.writeFileSync(`${customerdatapath}/${argset[i]}.json`, JSON.stringify(customerobject, null, '\t'));
                };
                break;
            default:
                throw new TypeError(`"${type}" is not a valid priority type.`)
        }
        await msg.channel.send(new Discord.MessageEmbed().setTimestamp().setColor(15105570).setTitle(`Success`))
    } catch (err) {
        await msg.channel.send(new Discord.MessageEmbed().setTimestamp().setColor(15158332).setTitle(`Error`).setDescription(`Please report this to the dev(s).${'```'}${err}${'```'}`));
    }
}

module.exports = {
    command,
    info
}