/*
                                                        WELCOME TO MY MESSY CODE LMAO
*/
//haha lmao kill me
//Promo Codes or Storewide Discounts
//Storewide price multiplier


// hugs? hugs! *hug*
require('dotenv').config()
//Constants
const Discord = require("discord.js");
const fs = require("fs");
const http = require("http");
const client = new Discord.Client();
const prefix = require("./storedata.json").prefix;
var aliases = {};
//Functions
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
} = require("./functions.cjs");

//Variables
var msgUserMentions;
var msgChannelMentions;
var msgAttachments;
//End of variables...
//Startup setups...
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log("Bot online successfully");
  console.error(
    "If any errors (red colour text) appears under this message, then that's a bad sign."
  );
  client.user.setPresence({
    activity: { name: `for orders...`, type: "WATCHING" },
    status: "online"
  });
  //client.user.setActivity(`Fizzy's every move  ...`, { type: 'LISTENING'});
});
client.on("ready", () => {
  /*let embed = new Discord.MessageEmbed()
    .setTitle('Reaction Roles')
    .setDescription(`React to this message to get certain roles.\n\nReact with 🥳 to be notified about new products or price changes.\nReact with 🔥 to be notified about new promo codes or sales.\nReact with 😕 to be notified about bot updates and downtimes or a server update.`)
    .setColor(15105570)
  client.channels.cache.get('709243532598050847').send(embed).then(async m => {
    await m.react('🥳')
    await m.react('🔥')
    await m.react('😕')
  })*/
  try {
    try {
      fs.readdirSync(`./commands`).filter(file => file.endsWith(`.cjs`)).forEach(file => {
        delete require.cache[require.resolve(`./commands/${file}`)];
        let command = require(`./commands/${file}`)
        command.info.aliases.forEach(alias => {
          aliases[alias] = file.slice(0, -4)
        })
      })
    } catch (err) {
      if (err) { client.channels.cache.get("720367748437508117").send("An error happened " + `at file ${err.fileName} at line ${err.lineNumber} at column ${err.columnNumber}` + "!\n```\n" + err.toString() + "\n```") };
    }
    client.channels.cache
      .get(`664012077563772938`)
      .messages.fetch({ limit: 100 })
      .then(messages => messages.each(msg => reactioncollect(msg, client)));
    client.channels.cache
      .get(`751063216595140608`)
      .messages.fetch({ limit: 100 })
      .then(messages => messages.each(msg => reactioncollect(msg, client)));
    client.channels.cache
      .get(`710103540152008725`)
      .messages.fetch({ limit: 100 })
      .then(messages => messages.each(msg => refundreaction(msg, client)));
    setInterval(() => {
      let date = new Date();
      let weekday = date.getUTCDay();
      //console.log(weekday)
      try {
        delete require.cache[require.resolve(`./storedata.json`)];
        var storedata = require(`./storedata.json`)
        if (storedata.updatepriority == true && date.getUTCDate() == 1) {
          storedata.updatepriority = false
          fs.writeFileSync(`./storedata.json`, JSON.stringify(storedata, null, '\t'))
          let guild = client.guilds.cache.get("663986068659503105")
          let files = fs.readdirSync(`./customer_data`)
          files.forEach(file => {
            delete require.cache[require.resolve(`./customer_data/${file}`)];
            let data = require(`./customer_data/${file}`)
            let customer = {
              id: file.slice(0, -5),
              data: j = JSON.parse(JSON.stringify(data))
            }
            if ((customer.data.priority.has === true || customer.data.priority.pending === true) && customer.data.priority.perm == false) {
              try {
                guild.members.fetch(file.slice(0, -5)).then((member) => {
                  if (member) {
                    //console.log(customer.id + ':' + JSON.stringify(customer.data.priority))
                    if (customer.data.priority.has === true && customer.data.priority.pending === false) {
                      //console.log("bye priority lmao")
                      member.roles.remove(`664034568671854593`)
                    } else if (customer.data.priority.pending === true) {
                      //console.log("bye pending lmao")
                      member.roles.add(`664034568671854593`)
                      member.roles.remove(`665945415094501386`)
                    } else {
                      console.log('nothing lmao')
                    }
                  }
                })
              } catch (err) {
                if (err) { client.channels.cache.get("720367748437508117").send("An error happened " + `at file ${err.fileName} at line ${err.lineNumber} at column ${err.columnNumber}` + "!\n```\n" + err.toString() + "\n```") };
              }
            }
            if (customer.data.priority.has == true && customer.data.priority.perm == false) {
              data.priority.has = false
            }
            if (customer.data.priority.pending == true) {
              data.priority.has = true
              data.priority.pending = false
            }
            fs.writeFileSync(`./customer_data/${file}`, JSON.stringify(data, null, '\t'))
          });
        } else if (storedata.updatepriority == false && date.getUTCDate() == 2) {
          storedata.updatepriority = true
          fs.writeFileSync(`./storedata.json`, JSON.stringify(storedata, null, '\t'))
        }
      } catch (err) {
        if (err) { client.channels.cache.get("720367748437508117").send("An error happened " + `at file ${err.fileName} at line ${err.lineNumber} at column ${err.columnNumber}` + "!\n```\n" + err.toString() + "\n```") };
      }
      if (
        weekday == 0 ||
        (weekday == 5 && date.getUTCHours() >= 11) ||
        weekday == 6
      ) {
        //console.log("weekend")
        if (
          client.channels.cache
            .get(`663986332166782976`)
            .permissionsFor("701440713585459200")
            .has("SEND_MESSAGES") === true
        ) {
          client.channels.cache
            .get(`663986332166782976`)
            .updateOverwrite(
              "701440713585459200",
              { SEND_MESSAGES: false },
              "It's the weekend!"
            );
          let d = new Date();
          d.setDate(d.getUTCDate() + ((((7 - d.getUTCDay()) % 7) + 1) % 7));
          d.setUTCHours(0);
          d.setUTCMinutes(0);
          d.setUTCSeconds(0);
          try {
            delete require.cache[require.resolve(`./storedata.json`)];
            let storedata = require(`./storedata.json`)
            storedata.open = false
            storedata.nextchange = Date.parse(d)
            fs.writeFileSync(`./storedata.json`, JSON.stringify(storedata, null, '\t'))
          } catch (err) {
            if (err) { client.channels.cache.get("720367748437508117").send("An error happened " + `at file ${err.fileName} at line ${err.lineNumber} at column ${err.columnNumber}` + "!\n```\n" + err.toString() + "\n```") };
          }
          client.channels.cache
            .get(`663986332166782976`)
            .messages.fetch(`710948903662649405`)
            .then(m =>
              m.edit(
                `The store is currently **closed**. It will open again on **${d.toLocaleDateString(
                  "en-GB",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  }
                )} at 00:00 GMT**.`
              )
            );
        }
      } else {
        //console.log("weekday")
        /*if (
          client.channels.cache
            .get(`663986332166782976`)
            .permissionsFor("701440713585459200")
            .has("SEND_MESSAGES") === false
        ) {
          client.channels.cache
            .get(`663986332166782976`)
            .updateOverwrite(
              "701440713585459200",
              { SEND_MESSAGES: true },
              "John, I hate mondays."
            );
          let d = new Date();
          d.setDate(d.getUTCDate() + ((((7 - d.getUTCDay()) % 7) + 5) % 7));
          d.setUTCHours(11);
          d.setUTCMinutes(0);
          d.setUTCSeconds(0);
          try {
            delete require.cache[require.resolve(`./storedata.json`)];
            let storedata = require(`./storedata.json`)
            storedata.open = true
            storedata.nextchange = Date.parse(d)
            fs.writeFileSync(`./storedata.json`, JSON.stringify(storedata, null, '\t'))
          } catch (err) {
            if (err) { client.channels.cache.get("720367748437508117").send("An error happened " + `at file ${err.fileName} at line ${err.lineNumber} at column ${err.columnNumber}` + "!\n```\n" + err.toString() + "\n```") };
          }
          client.channels.cache
            .get(`663986332166782976`)
            .messages.fetch(`710948903662649405`)
            .then(m =>
              m.edit(
                `The store is currently **open**. It will close again on **${d.toLocaleDateString(
                  "en-GB",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  }
                )} at 11:00 GMT**.`
              )
            );
        }*/
      }
    }, 60000);
    client.channels.cache.get("709243532598050847").messages.fetch("738857398428500050")
  } catch (err) {
    if (err) { client.channels.cache.get("720367748437508117").send("An error happened " + `at file ${err.fileName} at line ${err.lineNumber} at column ${err.columnNumber}` + "!\n```\n" + err.toString() + "\n```") };
  }
});

client.on("message", msg => {
  //Return Statements
  if (msg.type != 'DEFAULT') return;
  if (msg.channel.type == 'dm') {
    if (msg.author.id != client.user.id) {
      let b = [...msg.attachments.values()]
      let attachmentarray = [];
      for (let i = 0; i < b.length; i++) {
        attachmentarray.push(b[i]);
      };
      let embed = new Discord.MessageEmbed().setTitle(`Message`).setDescription(`${msg.content}`).addField(`Author`, `<@${msg.author.id}> (${msg.author.id})`).setTimestamp().setColor(15105570);
      client.channels.cache.get(`760524147062734859`).send({ files: attachmentarray, embed: embed });
    };
    return;
  };
  if (msg.author.bot) return;
  if (!msg.content.toLowerCase().startsWith(prefix)) return;
  //data
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
  //commands
  var args = msg.content.slice(prefix.length).trim().split(/ +/g);
  var command = args.shift().toLowerCase();
  try {
    fs.access(`./commands/${command}.cjs`, fs.constants.F_OK, (error) => {
      if (!error) {
        delete require.cache[require.resolve(`./commands/${command}.cjs`)];
        let module = require(`./commands/${command}.cjs`)
        module.command(client, msg, args, ops, processors)
      } else {
        if (aliases[command]) {
          let cmd = aliases[command];
          fs.access(`./commands/${cmd}.cjs`, fs.constants.F_OK, (error) => {
            if (!error) {
              delete require.cache[require.resolve(`./commands/${cmd}.cjs`)];
              let module = require(`./commands/${cmd}.cjs`)
              module.command(client, msg, args, ops, processors)
            }
          });
        }
      }
    });
  } catch (err) {
    if (err) { client.channels.cache.get("720367748437508117").send("An error happened " + `at file ${err.fileName} at line ${err.lineNumber} at column ${err.columnNumber}` + "!\n```\n" + err.toString() + "\n```") };
  }
  //Channel specfici stuff
  if (msg.channel.id == "705605323481940009") {
    if (
      msg.guild.members.resolve(msg.content) != undefined &&
      !msg.guild.members
        .resolve(msg.content)
        .roles.cache.has("664829894265667604")
    ) {
      let member = msg.guild.members.resolve(msg.content);
      if (
        member.roles.highest.position <= member.guild.me.roles.highest.position
      ) {
        member.roles.add("664829894265667604", [`Blacklisted.`]);
      } else {
        client.users.cache
          .get(process.env.FIZZID)
          .send(
            `**${member.user.tag} just joined FizzStores and is Blacklisted**, however I was unable to give them the blacklist role due to their role(s) being higher than my highest role.`
          );
      }
    }
  } else if (msg.channel.id == "711045088146358334") {
    if (
      msg.guild.members.resolve(msg.content) != undefined &&
      !msg.guild.members
        .resolve(msg.content)
        .roles.cache.has("664829894265667604")
    ) {
      let member = msg.guild.members.resolve(msg.content);
      if (
        member.roles.highest.position <= member.guild.me.roles.highest.position
      ) {
        member.roles.add("664825709310640142", [`permPRIORITY.`]);
      } else {
        client.users.cache
          .get(process.env.FIZZID)
          .send(
            `**${member.user.tag} just joined FizzStores and has permPRIORITY**, however I was unable to give them the permPRIORITY role due to their role(s) being higher than my highest role.`
          );
      }
    }
  }
  if (msg.channel.id === `664012077563772938`) {
    reactioncollect(msg, client);
  }
});

client.on("messageDelete", msg => { });

client.on("guildMemberAdd", member => {
  if (member.guild.id == "663986068659503105") {
    fs.access(`./customer_data/${member.id}.json`, fs.constants.F_OK, (err) => {
      if (err) {
        let customerobject = {
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
        //console.log(customerobject)
        fs.writeFile(`./customer_data/${member.id}.json`,
          JSON.stringify(customerobject, null, '\t'),
          err => { if (err) { client.channels.cache.get("720367748437508117").send("An error happened " + `at file ${err.fileName} at line ${err.lineNumber} at column ${err.columnNumber}` + "!\n```\n" + err.toString() + "\n```") }; })
      } else {
        delete require.cache[require.resolve(`./customer_data/${member.id}.json`)];
        let customerobject = require(`./customer_data/${member.id}.json`)
        customerobject.priority.pending = false
        if (customerobject.priority.perm == true) {
          if (
            member.guild.roles.cache.get("664825709310640142").position <=
            member.guild.me.roles.highest.position
          ) {
            member.roles.add("664825709310640142", [`permPRIORITY.`]);
          } else {
            client.users.cache
              .get(process.env.FIZZID)
              .send(
                `**${member.user.tag} just joined FizzStores and has permPRIORITY**, however I was unable to give them the permPRIORITY role due to their role(s) being higher than my highest role.`
              );
          }
        } else {
          customerobject.priority.has = false
        }
        if (customerobject.blacklisted == true) {
          if (
            member.guild.roles.cache.get("664829894265667604").position <=
            member.guild.me.roles.highest.position
          ) {
            member.roles.add("664829894265667604", [`Blacklisted.`]);
          } else {
            client.users.cache
              .get(process.env.FIZZID)
              .send(
                `**${member.user.tag} just joined FizzStores and is Blacklisted**, however I was unable to give them the blacklist role due to their role(s) being higher than my highest role.`
              );
          }
        }
        fs.writeFile(`./customer_data/${member.id}.json`,
          JSON.stringify(customerobject, null, '\t'),
          err => { if (err) { client.channels.cache.get("720367748437508117").send("An error happened " + `at file ${err.fileName} at line ${err.lineNumber} at column ${err.columnNumber}` + "!\n```\n" + err.toString() + "\n```") }; })
      }
    });
  }
});
client.on('guildMemberUpdate', (oldmember, currentmember) => {
  if (currentmember.guild.id == "663986068659503105") {
    delete require.cache[require.resolve(`./customer_data/${currentmember.id}.json`)];
    let customerobject = require(`./customer_data/${currentmember.id}.json`)
    /*if (currentmember.roles.cache.has("664034568671854593") ||
      currentmember.roles.cache.has("664825709310640142")) {
      customerobject.priority.has = true
      if (currentmember.roles.cache.has("664825709310640142")) {
        customerobject.priority.perm = true
      }
    } else {
      customerobject.priority.has = false
      customerobject.priority.perm = false
    }
    if (currentmember.roles.cache.has("665945415094501386")) {
      customerobject.priority.pending = true
    } else {
      customerobject.priority.pending = false
    }*/
    if (currentmember.roles.cache.has("664829894265667604")) {
      customerobject.blacklisted = true
    } else {
      customerobject.blacklisted = false
    }
    fs.writeFile(`./customer_data/${currentmember.id}.json`,
      JSON.stringify(customerobject, null, '\t'),
      err => { if (err) { client.channels.cache.get("720367748437508117").send("An error happened " + `at file ${err.fileName} at line ${err.lineNumber} at column ${err.columnNumber}` + "!\n```\n" + err.toString() + "\n```") }; })
  }
});
client.on('messageReactionAdd', (reaction, user) => {
  try {
    if (reaction.message.id == "738857398428500050" && reaction.emoji.name == "🥳") {
      client.guilds.cache.get("663986068659503105").member(user.id).roles.add("709244191300911104");
    } else if (reaction.message.id == "738857398428500050" && reaction.emoji.name == "🔥") {
      client.guilds.cache.get("663986068659503105").member(user.id).roles.add("709245867613356113");
    } else if (reaction.message.id == "738857398428500050" && reaction.emoji.name == "😕") {
      client.guilds.cache.get("663986068659503105").member(user.id).roles.add("709245997691174942");
    }
  } catch (err) { if (err) { client.channels.cache.get("720367748437508117").send("An error happened " + `at file ${err.fileName} at line ${err.lineNumber} at column ${err.columnNumber}` + "!\n```\n" + err.toString() + "\n```") }; }
});
client.on('messageReactionRemove', (reaction, user) => {
  try {
    if (reaction.message.id == "738857398428500050" && reaction.emoji.name == "🥳") {
      client.guilds.cache.get("663986068659503105").member(user.id).roles.remove("709244191300911104");
    } else if (reaction.message.id == "738857398428500050" && reaction.emoji.name == "🔥") {
      client.guilds.cache.get("663986068659503105").member(user.id).roles.remove("709245867613356113");
    } else if (reaction.message.id == "738857398428500050" && reaction.emoji.name == "😕") {
      client.guilds.cache.get("663986068659503105").member(user.id).roles.remove("709245997691174942");
    }
  } catch (err) { if (err) { client.channels.cache.get("720367748437508117").send("An error happened " + `at file ${err.fileName} at line ${err.lineNumber} at column ${err.columnNumber}` + "!\n```\n" + err.toString() + "\n```") }; }
});
//Token
client.login(process.env.TOKEN);
//bet
module.exports = { client };