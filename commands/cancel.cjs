const Discord = require("discord.js");
const fs = require('fs');
const info = {
    aliases: [],
    usage: "<order id>",
    description: "Used to cancel an active order."
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
    let arg = args[0];
    //console.log(arg);
    if (arg != undefined && arg.length > 0) {
        client.channels.cache
            .get("664012077563772938")
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

                    if (customer.user.id === msg.author.id) {
                        client.channels.cache
                            .get("709386190238908436")
                            .send(
                                `Order ${orderid} cancelled by customer.`,
                                embed.setDescription("❌ Cancelled Order").setColor(0x4287f5)
                            );
                        ordermsg
                            .delete({ reason: "Order cancelled." })
                            .then(message => countorder(client));
                        msg.channel
                            .send("Order cancelled successfully.")
                            .then(trash =>
                                trash.delete({ reason: "Clearing trash.", timeout: 2000 })
                            );
                        delete require.cache[require.resolve(`../order_backups/${orderid}.json`)];
                        let orderobject = require(`../order_backups/${orderid}.json`);
                        orderobject.active = false
                        orderobject.status = "cancelled"
                        console.log(JSON.stringify(orderobject, null, '\t'));
                        fs.writeFile(`./order_backups/${orderid}.json`, JSON.stringify(orderobject, null, '\t'), err => { if (err) throw err; })
                    } else {
                        msg.channel
                            .send("You cannot cancel another person's order.")
                            .then(trash =>
                                trash.delete({ reason: "Clearing trash.", timeout: 2000 })
                            );
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
            .send("Please supply an order id.")
            .then(trash =>
                trash.delete({ reason: "Clearing trash.", timeout: 2000 })
            );
    }
}

module.exports = {
    command,
    info
}