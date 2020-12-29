const Discord = require('discord.js');
const fs = require('fs');

function finditem(string, type) {
    string = string.toLowerCase();
    delete require.cache[require.resolve(`./data/data.js`)];
    var {
        prioritymin,
        ops,
        pdiscount,
        alldiscount,
        codes,
        processors,
        itemprices,
        woodprices,
        giftprices,
        bots
    } = require("./data/data.js");
    if (type === "g") {
        for (let i in giftprices) {
            if (string.includes(i)) {
                let itemdata = {
                    name: giftprices[i][0],
                    price: giftprices[i][1][type],
                    key: i,
                    limit: giftprices[i][2]
                };
                return itemdata;
            }
        }
    } else if (type === "w") {
        for (let i in woodprices) {
            if (string.includes(i)) {
                let itemdata = {
                    name: `Chunk of ${woodprices[i].name} Wood`,
                    price: woodprices[i].price[type],
                    key: i,
                    limit: woodprices[i].limit
                };
                return itemdata;
            }
        }
    } else if (type === "b" || type === "u") {
        let typefunc = () => {
            if (type === "b") {
                return " (Boxed)";
            } else if (type === "u") {
                return " (Unboxed)";
            }
        };
        for (let i in itemprices) {
            if (string.includes(i) && itemprices[i][1][type] != undefined) {
                let itemdata = {
                    name: itemprices[i][0] + typefunc(),
                    price: itemprices[i][1][type],
                    key: i,
                    limit: itemprices[i][2]
                };
                return itemdata;
            }
        }
    }
};
function milliseconverter(millisec) {
    var seconds = (millisec / 1000).toFixed(0);
    var minutes = Math.floor(seconds / 60);
    var hours = "";
    if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        hours = hours >= 10 ? hours : "0" + hours;
        minutes = minutes - hours * 60;
        minutes = minutes >= 10 ? minutes : "0" + minutes;
    }

    seconds = Math.floor(seconds % 60);
    seconds = seconds >= 10 ? seconds : "0" + seconds;
    if (hours != "") {
        return hours + ":" + minutes + ":" + seconds;
    }
    return minutes + ":" + seconds;
}
function splice(array, value, length, deletionamount) {
    array.splice(length, deletionamount, value);
    return array;
}
async function countorder(client) {
    delete require.cache[require.resolve(`./data/data.js`)];
    var {
        prioritymin,
        ops,
        pdiscount,
        alldiscount,
        codes,
        processors,
        itemprices,
        giftprices,
        bots
    } = require("./data/data.js");
    let channels = ['751063216595140608', '664012077563772938']
    let processed = 0;
    let processing = 0;
    for (let i = 0; i < channels.length; i++) {
        let channel = channels[i]
        let rawmessages = await client.channels.cache
            .get(channel)
            .messages.fetch({ limit: 100 });
        let messages = rawmessages.filter(message => (bots.includes(message.author.id) && !(message.deleted)))
        processing += messages
            .filter(message =>
                message.reactions.cache.every(
                    reaction => reaction.emoji.name != "✅"
                )
            ).size;
        processed += messages
            .filter(message =>
                message.reactions.cache.some(
                    reaction => reaction.emoji.name == "✅"
                )
            ).size;
    }
    await client.channels.cache.get("704863865069895730")
        .setName(`Awaiting Processing: ${String(processing)}`);
    await client.channels.cache.get("708503372189401120")
        .setName(`Ready for Delivery: ${String(processed)}`);
    let storedata = require(`./storedata.json`)
    storedata.orders.processing = processing;
    storedata.orders.processed = processed;
    storedata.orders.active = messages.size;
    fs.writeFileSync(`./storedata.json`, JSON.stringify(storedata, null, '\t'))
    return {
        processing: processing,
        processed: processed,
        active: messages.size
    };
}
function reactioncollect(msg, client) {
    try {
        delete require.cache[require.resolve(`./data/data.js`)];
        var {
            prioritymin,
            ops,
            pdiscount,
            alldiscount,
            codes,
            processors,
            itemprices,
            giftprices,
            bots
        } = require("./data/data.js");
        msg.createReactionCollector(
            (reaction, user) =>
                (Object.keys(processors).includes(user.id) &&
                    (msg.channel.id == '664012077563772938' && processors[user.id].perms.split("")[0] == "1")
                    ||
                    (msg.channel.id == '751063216595140608' && processors[user.id].perms.split("")[1] == "1")
                ) &&
                (reaction.emoji.name === "⚠️" ||
                    reaction.emoji.name === "✅" ||
                    reaction.emoji.name === "🏁" ||
                    reaction.emoji.name === "❌" ||
                    reaction.emoji.name === "🅱️")
        ).on("collect", async (r, processguyidkvariablenamehere) => {
            //"708503372189401120"
            let embed = r.message.embeds[0];
            let customeruser = client.users.resolve(embed.fields[0].value.substring(2, 20))
            let customer = client.guilds.cache.get("663986068659503105").members.resolve(
                embed.fields[0].value.substring(2, 20)
            );
            let orderid = embed.fields[1].value;
            delete require.cache[require.resolve(`./customer_data/${customer.id}.json`)];
            let customerdata = require(`./customer_data/${customer.id}.json`)
            try {
                fs.accessSync(`./order_backups/${orderid}.json`, fs.constants.F_OK)
            } catch (error) {
                if (error) {
                    var neworderobject = {
                        "customer": customer.id,
                        "id": orderid,
                        "number": "n/a",
                        "active": true,
                        "status": "in progress",
                        "columnleft": "N/A",
                        "columnright": "N/A",
                        "embed": embed
                    };
                }
            }
            try {
                if (neworderobject !== undefined) {
                    fs.writeFileSync(`./order_backups/${orderid}.json`, JSON.stringify(neworderobject, null, '\t'))
                    delete require.cache[require.resolve(`./order_backups/${orderid}.json`)];
                }
            } catch (err) {
                if (err) { client.channels.cache.get("720367748437508117").send("An error happened " + `at file ${err.fileName} at line ${err.lineNumber} at column ${err.columnNumber}` + "!\n```\n" + err.toString() + "\n```") };
            }
            delete require.cache[require.resolve(`./order_backups/${orderid}.json`)];
            let orderobject = require(`./order_backups/${orderid}.json`);
            if (r.emoji.name === "❌") {
                orderobject.active = false
                orderobject.status = "denied"
                fs.writeFile(`./order_backups/${orderid}.json`, JSON.stringify(orderobject, null, '\t'), err => { if (err) throw err; })
                await customer.send(
                    `**Your order with ID ${orderid} has been denied** DM ${processguyidkvariablenamehere.tag} for more details.`
                );
                await client.channels.cache
                    .get("709386190238908436")
                    .send(
                        `Order ${orderid} denied by ${processguyidkvariablenamehere.tag} (${processguyidkvariablenamehere.id})`,
                        embed.setDescription("❌ Denied Order").setColor(0x4287f5)
                    );
                r.message
                    .delete({ reason: "Order denied." })
                    .then(message => countorder(client));
            } else if (r.emoji.name === "🏁") {
                await customer.send(
                    `**Your order with ID ${orderid} has been completed!** Thank you for shopping with FizzStores!\nThis receipt serves as a valid proof of purchase. You may put in a refund request within 72 hours of receiving this receipt. For more information, contact Support.`,
                    r.message.embeds[0]
                        .setTitle("__**FizzStores Receipt**__")
                        .setDescription(
                            "Thank you for shopping with FizzStores. This embed message, when screenshotted with proof of your user account, serves as a valid form of proof of purchase. You are eligible for refunds within the next 72 hours from the generation of this receipt. For more details/questions, DM Fizz."
                        )
                );
                await client.channels.cache
                    .get("709386190238908436")
                    .send(
                        `Order ${orderid} completed by ${processguyidkvariablenamehere.tag} (${processguyidkvariablenamehere.id})`,
                        r.message.embeds[0]
                            .setDescription("🏁 Completed Order")
                            .setColor(0x00ff00)
                    );
                orderobject.active = false
                orderobject.status = "completed"
                fs.writeFile(`./order_backups/${orderid}.json`, JSON.stringify(orderobject, null, '\t'), err => { console.error(err); })
                if (customerdata.settings.recorddata == true) {
                    customerdata.totalspent = customerdata.totalspent + orderobject.price
                    //console.log(customerdata)
                    fs.writeFile(`./customer_data/${customer.id}.json`, JSON.stringify(customerdata, null, '\t'), err => { if (err) throw err; })
                }
                if (
                    orderid.toLowerCase().startsWith("y") &&
                    !customer.roles.cache.has("665945415094501386")
                ) {
                    if (
                        customer.roles.highest.position <=
                        client.guilds.cache.get(msg.guild.id).me.roles.highest.position
                    ) {
                        customer.roles.add("665945415094501386", [
                            `Order over ${prioritymin} before discounts.`
                        ]);
                    } else {
                        await client.users.cache
                            .get(process.env.FIZZID)
                            .send(
                                `**${customer.user.tag} qualified for FizzPriority**, however I was unable to give them the pending role due to their role(s) being higher than my highest role.`
                            );
                    }
                }
                r.message
                    .delete({ reason: "Order completed." })
                    .then(message => countorder(client));
            } else if (r.emoji.name === "⚠️" && customerdata.settings.dmnotifications == true) {
                await customer
                    .send(
                        `**Your order with ID ${orderid} is now being processed by ${processguyidkvariablenamehere.tag}!**`
                    )
                    .then(message => countorder(client));
            } else if (r.emoji.name === "☑️" && customerdata.settings.dmnotifications == true) {
                await customer
                    .send(
                        `**Your order with ID ${orderid} has been confirmed!** It is now in the queue awaiting processing.`
                    )
                    .then(message => countorder(client));
            } else if (r.emoji.name === "✅" && customerdata.settings.dmnotifications == true) {
                await customer
                    .send(
                        `**Your order with ID ${orderid} is ready for delivery!** Please DM ${processguyidkvariablenamehere.tag} with a desired date and time for delivery in GMT and your order ID. Make sure you do not forget your time zone relative to GMT.\nTo find your timezone relative to GMT, visit this website: https://whatismytimezone.com/.`,
                        r.message.embeds[0].setTitle("__**FizzStores Order Details**__")
                    )
                    .then(message => countorder(client));
            } else if (r.emoji.name === "🅱️") {
                r.message
                    .delete({
                        reason: "Order denied, member blacklisted."
                    })
                    .then(message => countorder(client));
                await customer.send(
                    `**You are blacklisted from shopping at FizzStores.** Please DM ${processguyidkvariablenamehere.tag} for more information.`
                );
                await client.channels.cache
                    .get("709386190238908436")
                    .send(
                        `Order ${orderid} denied and ${customer.tag} blacklisted by ${processguyidkvariablenamehere.tag} (${processguyidkvariablenamehere.id})`,
                        embed
                            .setDescription("❌ Denied Order\n🅱️ Member Blacklisted")
                            .setColor(0x4287f5)
                    );
                await client.channels.cache.get("705605323481940009").send(customer.user.id);
                if (
                    customer.roles.highest.position <=
                    client.guilds.cache.get(msg.guild.id).me.roles.highest.position &&
                    !customer.roles.cache.has("664829894265667604")
                ) {
                    customer.roles.add("664829894265667604", [`Blacklisted.`]);
                } else {
                    await client.users.cache
                        .get(process.env.FIZZID)
                        .send(
                            `**${customer.user.tag} is Blacklisted**, however I was unable to give them the blacklist role due to their role(s) being higher than my highest role.`
                        );
                }
            }
        });
    } catch (err) {
        if (err) { client.channels.cache.get("720367748437508117").send("An error happened " + `at file ${err.fileName} at line ${err.lineNumber} at column ${err.columnNumber}` + "!\n```\n" + err.toString() + "\n```") };
    }
} //does reaction stuff to #order-status, customer auto DMs stuff yknow
function refundreaction(msg, client) {
    delete require.cache[require.resolve(`./data/data.js`)];
    var {
        prioritymin,
        ops,
        pdiscount,
        alldiscount,
        codes,
        processors,
        itemprices,
        giftprices,
        bots
    } = require("./data/data.js");
    msg
        .createReactionCollector(
            (reaction, user) =>
                Object.keys(processors).includes(user.id) &&
                (reaction.emoji.name === "✅" ||
                    reaction.emoji.name === "🏁" ||
                    reaction.emoji.name === "❌")
        )
        .on("collect", (r, processguyidkvariablenamehere) => {
            //"708503372189401120"
            let embed = r.message.embeds[0];
            let customer = r.message.guild.members.resolve(
                embed.fields[0].value.substring(2, 20)
            );
            let orderid = embed.fields[1].value;
            delete require.cache[require.resolve(`./order_backups/${orderid}.json`)];
            let orderobject = require(`./order_backups/${orderid}.json`);
            orderobject.active = false
            orderobject.status = "completed"
            fs.writeFile(`./order_backups/${orderid}.json`, JSON.stringify(orderobject, null, '\t'), err => { if (err) { throw err; } })
            if (r.emoji.name === "❌") {
                customer.send(
                    `**Your refund request for order ${orderid} has been denied.** DM ${processguyidkvariablenamehere.tag} for more details.`
                );
                client.channels.cache
                    .get("709386190238908436")
                    .send(
                        `Refund for order ${orderid} denied by ${processguyidkvariablenamehere.tag} (${processguyidkvariablenamehere.id})`,
                        r.message.embeds[0]
                            .setTitle("__**FizzStores Refund Request**__")
                            .setDescription("❌ Denied Refund")
                    );
                r.message.delete({ reason: "Request denied." });
            } else if (r.emoji.name === "✅") {
                customer.send(
                    `**Your refund request for order ${orderid} has been approved.** Please state a time for the transaction in GMT and your order ID. Make sure you do not forget your time zone relative to GMT.\nTo find your timezone relative to GMT, visit this website: https://whatismytimezone.com/.`,
                    r.message.embeds[0].setTitle("__**FizzStores Refund Request**__")
                );
                msg.reactions.removeAll().then(m => {
                    m.react("🏁");
                });
            } else if (r.emoji.name === "🏁") {
                customer.send(
                    `**Your refund request for order ${orderid} has been marked complete.** If you think this was a mistake, DM ${processguyidkvariablenamehere.tag}.`
                );
                client.channels.cache
                    .get("709386190238908436")
                    .send(
                        `Refund for order ${orderid} completed by ${processguyidkvariablenamehere.tag} (${processguyidkvariablenamehere.id})`,
                        r.message.embeds[0]
                            .setTitle("__**FizzStores Refund Request**__")
                            .setDescription("🏁 Completed Refund")
                    );
                r.message.delete({ reason: "Request marked complete." });
            }
        });
}
function booltostring(bool) {
    if (bool === true) {
        return "Yes";
    } else {
        return "No";
    }
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
function numberWithoutCommas(x) {
    return Number(
        x
            .toString()
            .split(",")
            .join("")
    );
}
module.exports = {
    finditem,
    milliseconverter,
    splice,
    countorder,
    reactioncollect,
    refundreaction,
    booltostring,
    numberWithCommas,
    numberWithoutCommas
}