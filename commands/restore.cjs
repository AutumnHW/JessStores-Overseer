const Discord = require("discord.js");
const fs = require('fs');
const info = {
    aliases: [],
    usage: "<order id>",
    description: "Used to restore a command. Only usable by VPs."
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
    if (Object.keys(processors).includes(msg.author.id)) {
        let arg = args[0];
        //console.log(arg);
        if (arg != undefined && arg.length > 0) {
            client.channels.cache
                .get("709386190238908436")
                .messages.fetch()
                .then(messages => {
                    let order = messages.filter(
                        message =>
                            message.author.id === client.user.id &&
                            message.embeds[0].fields[1].value == arg
                    );
                    //console.log(order);
                    if (order.size >= 1) {
                        let ordermsg = order.array()[0];
                        //console.log(order.array());
                        //console.log(ordermsg);
                        let embed = ordermsg.embeds[0];
                        let orderid = embed.fields[1].value;
                        let customer = msg.guild.members.resolve(
                            embed.fields[0].value.substring(2, 20)
                        );
                        var priority =
                            customer.roles.cache.has("664825709310640142") ||
                            msg.member.roles.cache.has("664034568671854593");
                        client.channels.cache
                            .get("664012077563772938")
                            .send(
                                embed
                                    .setDescription("Restored Order")
                                    .setColor(priority == true ? 0xff0000 : 0xffa500)
                            )
                            .then(m => {
                                m.react("☑️");
                                if (priority == true) {
                                    m.react("❗");
                                }
                                countorder(client);
                                reactioncollect(m, client);
                            });
                        customer.send(
                            `**Your order ${orderid} has been restored.** Order details below.`,
                            embed
                                .setDescription("Restored Order")
                                .setColor(priority == true ? 0xff0000 : 0xffa500)
                        );
                        try {
                            delete require.cache[require.resolve(`./order_backups/${orderid}.json`)];
                            let orderobject = require(`./order_backups/${orderid}.json`);
                            orderobject.active = true
                            orderobject.status = "restored"
                            fs.writeFile(`./order_backups/${orderid}.json`, JSON.stringify(orderobject, null, '\t'), err => { if (err) throw err; })
                        } catch {
                            error => { throw error; }
                        }
                    } else {
                        msg.channel
                            .send("Order not found.")
                            .then(trash =>
                                trash.delete({ reason: "Clearing trash.", timeout: 2000 })
                            );
                    }
                });
        } else {
            msg.channel
                .send("Please supply a valid order id.")
                .then(trash =>
                    trash.delete({ reason: "Clearing trash.", timeout: 2000 })
                );
        }
    } else {
        msg.channel.send("You are not authorized to use this command.");
    }
}

module.exports = {
    command,
    info
}