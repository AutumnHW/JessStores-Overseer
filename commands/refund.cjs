const Discord = require("discord.js");
const fs = require('fs');
const info = {
    aliases: ["r"],
    usage: "<order id>",
    description: "The command used to request a refund."
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
            .get("709386190238908436")
            .messages.fetch()
            .then(messages => {
                let order = messages.filter(
                    message =>
                        message.author.id === client.user.id &&
                        message.embeds[0].fields[1].value == arg
                );
                //console.log(order)
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
                    if (order.every(orderm => orderm.embeds[0].color == 0x00ff00)) {
                        if (customer.user.id === msg.author.id) {
                            client.channels.cache
                                .get("710103540152008725")
                                .send(
                                    `Customer requested refund on order ${orderid}.\nOrder was marked delivered on ${ordermsg.createdAt.toUTCString()}.`,
                                    embed.setDescription("Refund Request").setColor(0xffff00)
                                )
                                .then(m => {
                                    m.react("✅");
                                    m.react("❌"); //DO IT HERE DO IT HERE DO IT HERE DO IT HERE DO IT HERE DO IT HERE DO IT HERE
                                    refundreaction(m, client);
                                });
                            customer.send(
                                `**Your refund request for order ${orderid} has been recieved.** We will contact you shortly.`
                            );
                            try {
                                delete require.cache[require.resolve(`./order_backups/${orderid}.json`)];
                                let orderobject = require(`./order_backups/${orderid}.json`);
                                orderobject.active = true
                                orderobject.status = "refund request"
                                fs.writeFile(`./order_backups/${orderid}.json`, JSON.stringify(orderobject, null, '\t'), err => { if (err) throw err; })
                            } catch {
                                error => { throw error; }
                            }
                        } else {
                            msg.channel
                                .send("You cannot refund another person's order.")
                                .then(trash =>
                                    trash.delete({ reason: "Clearing trash.", timeout: 2000 })
                                );
                        }
                    } else {
                        msg.channel.send(
                            "Please supply a valid order id. This order was denied or was already refunded."
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
            .send("Please supply a valid order id.")
            .then(trash =>
                trash.delete({ reason: "Clearing trash.", timeout: 2000 })
            );
    }
}
module.exports = {
    command,
    info
}