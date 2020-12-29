const Discord = require("discord.js");
const fs = require('fs');
const info = {
    aliases: ["b"],
    usage: "",
    description: "The command used to place an order."
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
        const blank = "\u200b";
        function genleftcolumn(items, itemcount, discountarray, price, code = undefined) {
            let itemarray = [];
            for (let i in items) {
                let itemdata = items[i]
                for (let t in itemdata) {
                    let itemtypedata = itemdata[t]
                    itemarray.push(`${itemtypedata.amount}x ${itemtypedata.name}`);
                }
            }
            if (codes[code] != undefined && codes[code].valid == true) {
                var avacado = discountarray.concat("Promo Code");
            } else {
                var avacado = discountarray
            }
            let leftcolumn = [
                "__Items__",
                itemarray.join('\n'),
                blank,
                "__Total__",
                itemcount,
                blank,
                "__Discount__",
                avacado.join('\n'),
                blank,
                "__Final Price__",
                numberWithCommas(price)
            ]
            return leftcolumn;
        }
        function genrightcolumn(items, price, discountarray, discount = 0, code = undefined) {
            let pricearray = [];
            for (let i in items) {
                let itemdata = items[i]
                for (let t in itemdata) {
                    let itemtypedata = itemdata[t]
                    pricearray.push(numberWithCommas(itemtypedata.price));
                }
            }
            if (codes[code] != undefined && codes[code].valid == true) {
                var avadaco = discountarray.concat(`${codes[code].discount.value * 100}%`);
            } else {
                var avadaco = discountarray
            }
            let rightcolumn = [
                "__Prices__",
                pricearray.join('\n'),
                blank,
                "__Total__",
                numberWithCommas(price),
                blank, blank,
                avadaco.join('\n')
            ]
            rightcolumn = rightcolumn.concat([
                blank,
                "__Total__",
                Math.round(String(discount * 100)) + "%"
            ]);
            return rightcolumn;
        }
        function getfinalprice(cost, swdiscount, pdiscount, code = undefined) {
            if (codes[code]) {
                let codeobject = codes[code];
                switch (codeobject.discount.type) {
                    case 0:
                        tdisc = swdiscount + pdiscount + codeobject.discount.value;
                        return Math.round(cost - cost * tdisc);
                    case 1:
                        tdisc = swdiscount + pdiscount;
                        return Math.round((cost - cost * tdisc) - codeobject.discount.value);
                }
            } else {
                tdisc = swdiscount + pdiscount;
                return Math.round(cost - cost * tdisc);
            }
        }
        const counterID = "702614692283154641";
        delete require.cache[require.resolve(`../data/data.js`)];
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
        } = require("../data/data.js");
        function prioritydiscount(priority) {
            if (priority === true) {
                return [true, pdiscount, String(pdiscount * 100) + "%"];
            } else {
                return [false, 0];
            }
        }
        let msgUserMentions = msg.mentions.users.array();
        if (msg.channel.id == "663986332166782976" || ops.includes(msg.author.id)) {
            msg.delete({ timeout: 500, reason: "Deleting command." });
            delete require.cache[require.resolve(`../storedata.json`)];
            let storedata = require(`../storedata.json`);
            if (!storedata.open && !ops.includes(msg.author.id)) {
                let time = milliseconverter(storedata.nextchange - Date.now()).split(':')
                return msg.channel.send(`The store is currently closed. It will open in ${time[0]} hours and ${time[1]} minutes.`).then(m => m.delete({ timeout: 5000 }));
            }
            if (ops.includes(msg.author.id) && msgUserMentions[0] !== undefined) {
                var customer = msgUserMentions[0];
            } else {
                var customer = msg.author;
            }
            try {
                fs.accessSync(`./customer_data/${customer.id}.json`, fs.constants.F_OK)
            } catch (e) {
                if (e) {
                    var nonexist = e;
                }
            }
            if (nonexist) {
                let member = client.guilds.cache.get("663986068659503105").members.resolve(customer.id);
                if (member !== undefined) {
                    var customerdata = {
                        orders: [],
                        totalspent: 0,
                        priority: {
                            pending: member.roles.cache.has("665945415094501386"),
                            has: member.roles.cache.has("664825709310640142") || member.roles.cache.has("664034568671854593"),
                            perm: member.roles.cache.has("664825709310640142"),
                            update: false
                        },
                        blacklisted: member.roles.cache.has("664829894265667604"),
                        lastbought: 0,
                        settings: {
                            recorddata: true,
                            orderindms: false,
                            dmnotifications: true
                        }
                    };
                    fs.writeFileSync(`./customer_data/${customer.id}.json`,
                        JSON.stringify(customerdata, null, '\t'))
                }
            } else {
                delete require.cache[require.resolve(`../customer_data/${customer.id}.json`)];
                var customerdata = require(`../customer_data/${customer.id}.json`);
            }
            if (customerdata.blacklisted) {
                await msg.channel.send("You cannot order because you have been blacklisted.")
                    .then(m => { m.delete({ timeout: 2000 }) });
                return
            }
            //console.log(customerobject)
            if (!(customerdata.lastbought + 1800000 <= Date.now() ||
                ops.includes(msg.author.id) ||
                Object.keys(processors).includes(msg.author.id) ||
                msg.member.roles.cache.has("706847857419878400"))) return await msg.channel.send(`Please wait **${milliseconverter((customerdata.lastbought + 1800000 - Date.now()))}** until you order again.`).then(m => m.delete({ timeout: 10000 }));
            //USER VARIABLES
            const embedtemplate = new Discord.MessageEmbed()
                .setAuthor(`${customer.username}'s Order`)
                .setColor(15105570)
                .setFooter(`${customer.username}'s Order`)
            const ordertemplate = new Discord.MessageEmbed(embedtemplate)
                .setTitle("Place your order.")
                .setDescription("**__Ordering Instructions__**\nThe format to add items to your order is `<Amount of Item> <Type of Item> <Name or Keyword of Item>`.\nThe types of items include `U` for unboxed items, `B` for boxed items, and `G` for gifts.\nReact ✅ to confirm your order or react with ❌ to cancel the order.\nBy placing an order, you agree to the terms and conditions found in <#664820197911298061>.\nThis prompt will automatically expire in 10 minutes.")
            const ordertemplate2 = new Discord.MessageEmbed(ordertemplate)
                .setDescription("By placing an order, you agree to the terms and conditions found in <#664820197911298061>.")
            const promotemplate = new Discord.MessageEmbed(embedtemplate)
                .setTitle("Enter a promo code.")
                .setDescription("React with ✅ to confirm. React with ❌ to cancel the order.\nThis prompt will automatically timeout after 5 minutes.")
            const vptemplate = new Discord.MessageEmbed(embedtemplate)
                .setTitle("Choose a Verified Partner.")
                .setDescription("Choose a preferred VP to take your order by typing the first numbers of their user ID. React with ✅ to confirm the order. React with ❌ to cancel the order.\nThis prompt will automatically timeout after 1 minute.")
            const notetemplate = new Discord.MessageEmbed(embedtemplate)
                .setTitle("Leave a Note")
                .setDescription("Leave a note on your order if you have one. React with ✅ to confirm. React with ❌ to cencel the order.\nThis prompt will automatically timeout after 5 minutes.")
            const finaltemplate = new Discord.MessageEmbed(embedtemplate)
                .setTitle("**__JessStores Order__**")
            if (customer.id != msg.author.id) finaltemplate.setDescription(`Order made on behalf of customer by ${msg.author.tag} (${msg.author.id})`);
            let priority = customerdata.priority.has
            const total = "__Total__";
            var code = undefined;
            var items = {};
            var woodcount = 0;
            var itemcount = 0;
            var totalprice = 0;
            var itemprice = 0;
            var woodprice = 0;
            var discounts = [];
            var discountpercents = [];
            var totaldiscount = 0;
            var prioritydis = prioritydiscount(priority);
            var finalprice = 0;
            var notes = [];
            if (prioritydis[0] === true) {
                discounts.unshift("Priority Discount");
                discountpercents.unshift(`${pdiscount * 100}%`)
                totaldiscount += pdiscount
            }
            if (alldiscount > 0) {
                discounts.unshift("Storewide Discount");
                discountpercents.unshift(`${alldiscount * 100}%`)
                totaldiscount += alldiscount
            }
            if (msg.guild.id != '663986068659503105') {
                notes.push(`Order made in ${msg.guild.name} (${msg.guild.id}).`)
            }
            let date = new Date();
            let orderid =
                String(100 + date.getUTCDate()).slice(1) +
                String(101 + date.getUTCMonth()).slice(1) +
                String(date.getUTCFullYear()).slice(2) +
                String(100 + date.getUTCHours()).slice(1) +
                String(100 + date.getUTCMinutes()).slice(1) +
                msg.author.id.slice(14);
            totaldiscount = alldiscount + prioritydis[1] + 0;
            let leftcolumn = genleftcolumn(items, itemcount, discounts, getfinalprice(totalprice, alldiscount, prioritydis[1]), code)
            let rightcolumn = genrightcolumn(items, totalprice, discountpercents, totaldiscount, code)
            if (customerdata.settings.orderindms == true) {
                var location = msg.author;
            } else {
                var location = msg.channel;
            }
            let itemprompt = await location.send(new Discord.MessageEmbed(ordertemplate).setTimestamp().addField("Order", leftcolumn, true).addField("\u200b", rightcolumn, true))
            itemprompt.react("✅");
            itemprompt.react("❌");
            //COLLECTS MESSAGES
            let msgcollector = itemprompt.channel.createMessageCollector(
                message => message.author.id === msg.author.id,
                { time: 600000 }
            );
            let itemtimeout = setTimeout(
                () =>
                    itemprompt.channel.send("❌ Prompt Timeout").then(warning => {
                        warning.delete({
                            timeout: 2000,
                            reason: "Delete warning."
                        });
                        msgcollector.stop();
                        itemprompt.delete({ timeout: 1000, reason: "Order timeout." });
                    }),
                600000
            );
            //RUNS WHEN A MESSAGE IS COLLECTED
            msgcollector.on("collect", message => {
                message.delete({ timeout: 500 })
                let stringarg = message.content
                    .toLowerCase()
                    .trim()
                    .split(/ +/g);
                let newargs = stringarg.shift();
                newargs = [newargs, stringarg.shift()];
                newargs = [Number(newargs[0]), newargs[1], stringarg.join(" ")];

                //console.log(newargs);
                // newargs[0] is amount, newargs[1] is type, newargs[2] is item
                let itemtype = newargs[1];
                let item = finditem(newargs[2], itemtype);
                let amount = Number(newargs[0]);
                if (item == null) {
                    return message.channel.send(
                        "❌ Invalid Order. Check your spelling and make sure that the item you're ordering exists!"
                    ).then(m =>
                        m.delete({
                            timeout: 1500,
                            reason: "Deleting warning message."
                        })
                    );
                }
                if (
                    (itemcount + amount) >
                    (priority === false ? 20 : 30)
                ) {
                    return message.channel.send(
                        `❌ Maximum of ${priority === false ? 20 : 30
                        } items per order${priority === false ?
                            "" :
                            " for customers with jessPriority"
                        }!`
                    ).then(m => m.delete({ timeout: 3000 }));
                };
                if (!Number.isInteger(amount)) {
                    return message.channel
                        .send("❌ Invalid Order. You can only buy whole items.")
                        .then(m =>
                            m.delete({
                                timeout: 1500,
                                reason: "Deleting warning message."
                            })
                        );
                }
                if (woodcount + amount > (priority ? 10 : 5) && itemtype == 'w') {
                    return message.channel.send(
                        `❌ Maximum of ${priority ? 10 : 5} chunks of wood per order${priority ? ` for customers with jessPriority` : ``}!`
                    ).then(m => m.delete({ timeout: 3000 }));
                }
                if (items[item.key] == undefined ||
                    items[item.key][newargs[1].toLowerCase()] == undefined) {
                    if (item.limit.has === false ||
                        (item.limit.has === true && amount <= item.limit.value)) {
                        if (amount > 0) {
                            if (items[item.key] == undefined) {
                                items[item.key] = {};
                            }
                            items[item.key][newargs[1].toLowerCase()] = {
                                name: item.name,
                                amount: amount,
                                price: item.price * amount
                            }
                            itemcount += amount;
                            if (itemtype == 'w') {
                                woodcount += amount;
                            }
                            totalprice += item.price * amount
                            switch (itemtype) {
                                case "w":
                                    woodprice += item.price * amount
                                    break;
                                case "b":
                                case "u":
                                    itemprice += item.price * amount
                                    break;
                            }
                        } else {
                            message.channel
                                .send("❌ Invalid Order. You must buy atleast 1 of an item.")
                                .then(m =>
                                    m.delete({
                                        timeout: 1500,
                                        reason: "Deleting warning message."
                                    })
                                );
                        }
                    } else {//bruh im here now lemme fix stuff
                        //blah blah
                        message.channel.send(
                            `❌ You may only order ${item.limit.value} of this item per order!`
                        ).then(m =>
                            m.delete({
                                timeout: 1500,
                                reason: "Deleting warning message."
                            })
                        );
                    }
                } else {
                    if (item.limit.has === false ||
                        (item.limit.has === true && amount <= item.limit.value)) {
                        if (items[item.key][newargs[1].toLowerCase()].amount + amount > 0) {
                            items[item.key][newargs[1].toLowerCase()].amount += amount;
                            //console.log(woodcount)
                            if (itemtype == 'w') {
                                woodcount += amount;
                            }
                            //console.log(woodcount)
                            items[item.key][newargs[1].toLowerCase()].price += item.price * amount;
                            itemcount += amount;
                            totalprice += item.price * amount
                            switch (itemtype) {
                                case "w":
                                    woodprice += item.price * amount
                                    break;
                                case "b":
                                case "u":
                                    itemprice += item.price * amount
                                    break;
                            }
                        } else {
                            itemcount -= items[item.key][newargs[1].toLowerCase()].amount;
                            if (itemtype == 'w') {
                                woodcount -= items[item.key][newargs[1].toLowerCase()].amount;
                            }
                            totalprice -= items[item.key][newargs[1].toLowerCase()].price
                            switch (itemtype) {
                                case "w":
                                    woodprice -= items[item.key][newargs[1].toLowerCase()].price
                                    break;
                                case "b":
                                case "u":
                                    itemprice -= items[item.key][newargs[1].toLowerCase()].price
                                    break;
                            }
                            delete items[item.key][newargs[1].toLowerCase()];
                        }
                    } else {
                        //blah blah
                        message.channel.send(
                            `❌ You may only order ${item.limit.value} of this item per order!`
                        ).then(m =>
                            m.delete({
                                timeout: 1500,
                                reason: "Deleting warning message."
                            })
                        );
                    }
                }
                let totaldiscount = alldiscount + prioritydis[1] + 0;
                finalprice = getfinalprice(totalprice, alldiscount, prioritydis[1])
                leftcolumn = genleftcolumn(items, itemcount, discounts, finalprice, code)
                rightcolumn = genrightcolumn(items, totalprice, discountpercents, totaldiscount, code)
                itemprompt.edit(new Discord.MessageEmbed(ordertemplate).setTimestamp().addField("Order", leftcolumn, true).addField("\u200b", rightcolumn, true));
            });
            //collect yes or noes
            let itemreaction = await itemprompt.awaitReactions(
                (reaction, user) =>
                    user.id === msg.author.id &&
                    (reaction.emoji.name === "✅" || reaction.emoji.name === "❌"), { max: 1 }
            )
            itemreaction = itemreaction.first()
            if (itemreaction.emoji.name === "❌") {
                msgcollector.stop();
                itemreaction.message.delete({
                    timeout: 1000,
                    reason: "User cancelled order."
                });
                clearTimeout(itemtimeout);
                return;
            } else if (itemcount <= 0) {
                itemreaction.message.channel.send("❌ You cannot order nothing!").then(m =>
                    m.delete({
                        timeout: 3000,
                        reason: "Deleting warning message."
                    })
                );
                //delete user's reaction
                let userReactions = itemreaction.message.reactions.cache.filter(reaction =>
                    reaction.users.cache.has(msg.author.id)
                );
                try {
                    for (let reaction of userReactions.values()) {
                        reaction.users.remove(msg.author.id);
                    }
                } catch (error) {
                    console.error("Failed to remove reactions.");
                }
                return;
            }
            itemreaction.message.reactions.removeAll();
            clearTimeout(itemtimeout);
            msgcollector.stop();
            let color = () => {
                if (priority === false) {
                    return 0xffa500;
                } else {
                    return 0xff0000;
                }
            };
            /*
                Promo code prompt
            */
            let codeprompt = await itemreaction.message.channel.send(new Discord.MessageEmbed(promotemplate).setTimestamp().addField("Promo Code", "None entered."))
            codeprompt.react("✅");
            codeprompt.react("❌");
            let promofinder = codeprompt.channel.createMessageCollector(
                message => message.author.id === msg.author.id,
                { time: 300000 }
            );
            let codetimeout = setTimeout(
                () =>
                    codeprompt.channel.send("❌ Prompt Timeout").then(warning => {
                        warning.delete({
                            timeout: 2000,
                            reason: "Delete warning."
                        });
                        promofinder.stop();
                        codeprompt.delete({
                            timeout: 1000,
                            reason: "Order timeout."
                        });
                        itemprompt.delete({ timeout: 1000, reason: "Order timeout." });
                    }),
                300000
            );
            promofinder.on("collect", async codemsg => {
                codemsg.delete()
                if (codes[codemsg.content.toLowerCase()] == undefined) {
                    codeprompt.channel.send("❌ Invalid Code.").then(m =>
                        m.delete({
                            timeout: 3000,
                            reason: "Deleting warning message."
                        })
                    );
                } else {
                    if (codes[codemsg.content.toLowerCase()].valid == false) {
                        return codeprompt.channel
                            .send("❌ The code you entered is not valid anymore.")
                            .then(m =>
                                m.delete({
                                    timeout: 3000,
                                    reason: "Deleting warning message."
                                })
                            );
                    }
                    code = codemsg.content.toLowerCase()
                    finalprice = getfinalprice(totalprice, alldiscount, prioritydis[1], code)
                    leftcolumn = genleftcolumn(items, itemcount, discounts, finalprice, code)
                    rightcolumn = genrightcolumn(items, totalprice, discountpercents, totaldiscount, code)
                    codeprompt.edit(new Discord.MessageEmbed(promotemplate).setTimestamp().addField("Promo Code", codemsg.content.toUpperCase()));
                    itemprompt.edit(new Discord.MessageEmbed(ordertemplate2).setTimestamp().addField("Order", leftcolumn, true).addField("\u200b", rightcolumn, true));
                }
            });
            let codereaction = await codeprompt.awaitReactions((reaction, user) => user.id === msg.author.id && (reaction.emoji.name === "✅" || reaction.emoji.name === "❌"), { max: 1 })
            codereaction = codereaction.first()
            promofinder.stop();
            codeprompt.delete({
                timeout: 1000,
                reason: "Order cancelled."
            });
            clearTimeout(codetimeout);
            if (codereaction.emoji.name == "❌") return itemprompt.delete({ timeout: 1000, reason: "Order cancelled." });   //Return and delete prompts if customer cancels order
            /*
                VP request prompt.
            */
            let vplist = [];
            Object.entries(processors).forEach(vp => {
                if (!vp[1].list) return;
                let vpuser = client.users.resolve(`${vp[0]}`);
                if (!vpuser) return;
                vplist.push(`${(vp[1].tz.has ? (vp[1].tz.value + (vp[1].tz.observesdst ? " (Observes DST)" : "")) : "N/A")} - ${vpuser.id} (${vpuser.username})`)
            })
            let vpprompt = await codeprompt.channel.send(new Discord.MessageEmbed(vptemplate).setColor(15105570).addField("Verified Partners", vplist))
            vpprompt.react('✅')
            vpprompt.react('❌')
            let vpfinder = vpprompt.channel.createMessageCollector(
                message => message.author.id === msg.author.id,
                { time: 60000 }
            );
            let chosenvplist = [];
            vpfinder.on('collect', vp => {
                vp.delete({ timeout: 500 })
                let filteredvps = Object.keys(processors).filter(e => e.startsWith(vp.content.trim()))
                if (filteredvps.length <= 0) return itemprompt.channel.send('❌ VP not found.').then(m => m.delete({ timeout: 1500 }));
                chosenvplist.unshift(filteredvps[0])
                itemprompt.edit(new Discord.MessageEmbed(ordertemplate2).setTimestamp().addField("Order", leftcolumn, true).addField("\u200b", rightcolumn, true).addField("Notes", `Customer requested <@${filteredvps[0]}> to process this order.`));
            })
            let vpreaction = await vpprompt.awaitReactions((reaction, user) => user.id === msg.author.id && (reaction.emoji.name === "✅" || reaction.emoji.name === "❌"), { max: 1 });
            vpreaction = vpreaction.first();
            vpfinder.stop();
            vpprompt.delete({ timeout: 1000 });
            if (vpreaction.emoji.name == '❌') return;
            if (chosenvplist.length > 0) { notes.push(`Customer requested <@${chosenvplist[0]}> to process this order.`); };
            /*
                Custom note prompt.
            */
            let customnote = [];
            let noteprompt = await codeprompt.channel.send(new Discord.MessageEmbed(notetemplate).addField("Note", `None entered.`));
            noteprompt.react('✅');
            noteprompt.react('❌');
            let notefinder = noteprompt.channel.createMessageCollector(
                message => message.author.id === msg.author.id,
                { time: 60000 }
            );
            notefinder.on('collect', note => {
                note.delete({ timeout: 500 });
                customnote.unshift(note.content);
                let itempromptembed = new Discord.MessageEmbed(ordertemplate2).setTimestamp().addField("Order", leftcolumn, true).addField("\u200b", rightcolumn, true);
                if (notes.length > 0) {
                    itempromptembed.addField('Notes', notes.concat(`Customer left note: ${'```'}${customnote[0]}${'```'}`));
                } else {
                    itempromptembed.addField('Notes', `Customer left note: ${'```'}${customnote[0]}${'```'}`);
                };
                itemprompt.edit(itempromptembed);
                noteprompt.edit(new Discord.MessageEmbed(notetemplate).addField("Note", `${'```'}${customnote[0]}${'```'}`));
            });
            let notereaction = await noteprompt.awaitReactions((reaction, user) => user.id === msg.author.id && (reaction.emoji.name === "✅" || reaction.emoji.name === "❌"), { max: 1 });
            notereaction = notereaction.first();
            if (customnote.length > 0) { notes.push(`Customer left note: ${'```'}${customnote[0]}${'```'}`); };
            notefinder.stop();
            noteprompt.delete({ timeout: 1000 });
            if (notereaction.emoji.name == '❌') return itemprompt.delete({ timeout: 1000 });    //Return if the customer cancelled the order.
            /*
                Final order
            */
            itemprompt.delete({ timeout: 1000 });
            orderid = (totalprice >= prioritymin ? "Y" : "N") + orderid;
            finalprice = getfinalprice(totalprice, alldiscount, prioritydis[1], code)
            wfinalprice = getfinalprice(woodprice, alldiscount, prioritydis[1], code)
            ifinalprice = getfinalprice(totalprice - woodprice, alldiscount, prioritydis[1], code)
            let finalembed = new Discord.MessageEmbed(finaltemplate)
                .setColor(color())
                .setTimestamp()
                .setFooter(`Order ID: ${orderid}`)
                .addField("Customer", `<@${customer.id}>`)
                .addField("Order ID", orderid)
                .addField(
                    "Order Number",
                    Number(
                        client.channels.cache
                            .get(counterID)
                            .name.slice("Orders: ".length)
                    ) + 1
                )
                .addField("Priority", booltostring(priority))
                .addField("Order", genleftcolumn(items, itemcount, discounts, finalprice, code), true)
                .addField("\u200b", genrightcolumn(items, totalprice, discountpercents, totaldiscount, code), true);
            let woods = {}
            for (let i in items) {
                let itemdata = items[i]
                if (itemdata['w']) woods[i] = {};
                for (let t in itemdata) {
                    if (t == 'w') woods[i][t] = itemdata[t];
                }
            }
            let finalembedwood = new Discord.MessageEmbed(finaltemplate)
                .setColor(color())
                .setTimestamp()
                .setFooter(`Order ID: W${orderid}`)
                .addField("Customer", `<@${customer.id}>`)
                .addField("Order ID", `W${orderid}`)
                .addField(
                    "Order Number",
                    Number(
                        client.channels.cache
                            .get(counterID)
                            .name.slice("Orders: ".length)
                    ) + 1
                )
                .addField("Priority", booltostring(priority))
                .addField("Order", genleftcolumn(woods, woodcount, discounts, wfinalprice, code), true)
                .addField("\u200b", genrightcolumn(woods, woodprice, discountpercents, totaldiscount, code), true);
            let notwoods = {}
            for (let i in items) {
                let itemdata = items[i]
                if (Object.keys(itemdata).some(v => v != 'w')) notwoods[i] = {};
                for (let t in itemdata) {
                    if (t != 'w') notwoods[i][t] = itemdata[t];
                }
            }
            let finalembeditem = new Discord.MessageEmbed(finaltemplate)
                .setColor(color())
                .setTimestamp()
                .setFooter(`Order ID: ${orderid}`)
                .addField("Customer", `<@${customer.id}>`)
                .addField("Order ID", `${orderid}`)
                .addField(
                    "Order Number",
                    Number(
                        client.channels.cache
                            .get(counterID)
                            .name.slice("Orders: ".length)
                    ) + 1
                )
                .addField("Priority", booltostring(priority))
                .addField("Order", genleftcolumn(notwoods, itemcount - woodcount, discounts, ifinalprice, code), true)
                .addField("\u200b", genrightcolumn(notwoods, totalprice - woodprice, discountpercents, totaldiscount, code), true);
            if (notes.length > 0) {
                finalembed.addField('Notes', notes)
                finalembedwood.addField('Notes', notes)
                finalembeditem.addField('Notes', notes)
            }
            if (Object.keys(notwoods).length > 0) {
                client.channels.cache //GET CHANNELS
                    .get(`664012077563772938`) //GET CHANNEL ID OF #ORDER-STATUS
                    .send(
                        finalembeditem
                    ).then(m => {
                        //console.log(m);
                        m.react("☑️");
                        if (priority === true) { m.react("❗") };
                        reactioncollect(m, client);
                        countorder(client);
                    })
            }
            if (Object.keys(woods).length > 0) {
                client.channels.cache //GET CHANNELS
                    .get(`751063216595140608`) //GET CHANNEL ID OF #ORDER-STATUS
                    .send(
                        finalembedwood
                    ).then(m => {
                        //console.log(m);
                        m.react("☑️");
                        if (priority === true) { m.react("❗") };
                        reactioncollect(m, client);
                        countorder(client);
                    })
            }
            customer.send(
                `**✅ Your order has been confirmed.${customer.id != msg.author.id ?
                    ` ${msg.author.tag} made the order on your behalf.` :
                    ``
                } The details are below. You will be notified if the status of your order changes.**`,
                finalembed
            );
            if (msg.guild.id != '663986068659503105') {
                let beginning = `__Server Invite for Order ${orderid}__\n**One use only.**\n`;
                if (msg.guild.vanityURLCode) {
                    client.channels.cache.get('750837708397608990').send(`${beginning}https://discord.gg/${msg.guild.vanityURLCode}/`);
                } else if (msg.guild.rulesChannel) {
                    let inv = await msg.guild.rulesChannel.createInvite({ maxAge: 0, maxUses: 1, unique: true, reason: "Inviting Verified Parner for Order Delivery." })
                    client.channels.cache.get('750837708397608990').send(`${beginning}${inv}`);
                } else {
                    let inv = await msg.channel.createInvite({ maxAge: 0, maxUses: 1, unique: true, reason: "Inviting Verified Parner for Order Delivery." })
                    client.channels.cache.get('750837708397608990').send(`${beginning}${inv}`);
                }
            }
            client.channels.cache
                .get(counterID)
                .setName(
                    "Orders: " +
                    String(
                        Number(
                            client.channels.cache
                                .get(counterID)
                                .name.slice("Orders: ".length)
                        ) + 1
                    ),
                    ["New Order"]
                );
            //WRITE STUFF LMAO
            customerdata.orders.push(orderid)
            customerdata.lastbought = Date.now();
            //console.log(customerdata)
            //console.log(customerdata)
            fs.writeFile(`./customer_data/${msg.author.id}.json`,
                JSON.stringify(customerdata, null, '\t'),
                err => {
                    if (err)
                        client.channels.cache.get("720367748437508117").send("An error happened somehwere!\n```\n" + err + "\n```");
                })
            let orderobject = {
                customer: customer.id,
                guild: msg.guild.id,
                id: orderid,
                number: Number(
                    client.channels.cache
                        .get(counterID)
                        .name.slice("Orders: ".length)
                ) + 1,
                priority: priority,
                active: true,
                status: "in progress",
                items: items,
                discount: totaldiscount,
                price: finalprice,
                qualifies: totalprice >= prioritymin,
                embed: JSON.stringify(finalembed, null, '\t')
            };
            fs.writeFile(`./order_backups/${orderid}.json`, JSON.stringify(orderobject, null, '\t'), err => {
                if (err)
                    client.channels.cache.get("720367748437508117").send("An error happened somehwere!\n```\n" + err + "\n```");
            });
        }
        //read #test
    } catch (err) {
        if (err) { await client.channels.cache.get("720367748437508117").send("An error happened " + `at file ${err.fileName} at line ${err.lineNumber} at column ${err.columnNumber}` + "!\n```\n" + err.toString() + "\n```") };
    }
}
module.exports = {
    command,
    info
}