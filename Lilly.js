var Discord = require("discord.js"),
      bot = new Discord.Client(),
      mysql = require('mysql'),
      config = require('./sql.json'),
      fs = require('fs'),
      isCommander = ["150077952711852033"],
      version = "Lilly v2.1",
      prefix = "$";

fs.readFile('token.txt', 'utf8', function (err, token) {
    if (err) {
        return console.log(err);
    }
    bot.loginWithToken(token);
});

var connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});
connection.connect();


bot.on('ready', function () {
    console.log('Bot online and ready On ' + bot.servers.length + " servers");
    bot.setPlayingGame(version);
});

bot.on("serverCreated", function (server) {
    console.log("Trying to insert server " + server.name + " into database");
    var info = {
        "servername": "'" + server.name + "'",
        "serverid": server.id,
        "ownerid": server.owner.id,
        "prefix": "~"
    };

    connection.query("INSERT INTO servers SET ?", info, function (error) {
        if (error) {
            console.log(error);
            return;
        }
        console.log("Server Inserted!");
    });
});

bot.on("serverDeleted", function (server) {
    console.log("Attempting to remove " + server.name + " from the database!");
    connection.query("DELETE FROM servers WHERE serverid = '" + server.id + "'", function (error) {
        if (error) {
            console.log(error);
            return;
        }
        console.log("Server Removed!");
    });
});


bot.on('serverNewMember', function(server, user) {
    if (server.id === "150294997571207168") {
        bot.sendMessage(server.name, "Welcome " + user.username + " to Lilly Lounge! | Read #rules Please");
        bot.addMemberToRole(user.id, server.roles.get("name", "Member"));
        bot.sendMessage("Join Role -> Member given to " + user.username);
    } else {
            bot.sendMessage(" Welcome " + user.username + " to " + server.name);
        }
    });

bot.on("message", function (message) {
    var input = message.content.toUpperCase();
    if (input === (prefix) + "PING") {
        var start = new Date(message.timestamp).getTime();
        bot.sendMessage(message, "Pong!", (error, botMessage) => {
            var end = new Date(botMessage.timestamp).getTime();
            bot.updateMessage(botMessage, "Pong! | took " + (end - start) + "ms.");
        });
    }

    if (input === (prefix) + "COMMANDS") {
        bot.sendMessage(message.author, "Available Commands: :one: $Hello Lilly :two: $Help :three: $Donate :four: $Invite :five: $Server :six: $ Ban,Kick,Mute and Unmute :seven: Youtube");
    }

    if (input === (prefix + "SERVERINFO")) {
            bot.options.disableEveryone = "true";
            console.log(message.sender.username + " executed: server");
            bot.sendMessage(message, "**" + message.server.name + "**" +
              "```" + "\nMember Count: " + message.server.members.length +
                "\nChannel Count: " + message.server.channels.length +
                "\nServer Region: " + message.server.region +
                "\nOwner: " + message.server.owner.name +
                "\nCreated: " + message.server.createdAt +
                "\nServer Icon: " + message.server.iconURL +

                "\nRoles: " + message.server.roles.map(r => r.name).join(", ") + "```");
        }

    if (input.startsWith(prefix + "MUTE")) {
        if (bot.memberHasRole(message.author, message.server.roles.get("name", "Bot Commander")) || isCommander.indexOf(message.sender.id) > -1) {
            if (message.mentions.length === 1) {
                for (var user of message.mentions) {
                    bot.addMemberToRole(user, message.server.roles.get("name", "muted"));
                    console.log(message.sender.username + " executed: Mute against " + user.name);
                    bot.sendMessage(message, "Muted User " + user);
                  }
              } else {
                  bot.reply(message, "You need to mention someone!")
              }
          } else {
              bot.reply(message, "You do not have `Bot Commander` role")
          }
      }

    if (input.startsWith(prefix + "BAN")) {
        if (bot.memberHasRole(message.author, message.server.roles.get("name", "Bot Commander")) || isCommander.indexOf(message.sender.id) > -1) {
            if (message.mentions.length === 1) {
                for (var user of message.mentions) {
                    bot.banMember(user, message.channel);
                    console.log(message.sender.username + " executed: ban against " + user.name);
                    bot.reply(message, "Banned User " + user);
                  }
              } else {
                  bot.reply(message, "You need to mention someone!")
              }
          } else {
              bot.reply(message, "You do not have `Bot Commander` role")
          }
      }

    if (input.startsWith(prefix + "UNMUTE")) {
        if (bot.memberHasRole(message.author, message.server.roles.get("name", "Bot Commander")) || isCommander.indexOf(message.sender.id) > -1) {
            if (message.mentions.length === 1) {
                for (var user of message.mentions) {
                    bot.removeMemberFromRole(user, message.server.roles.get("name", "muted"));
                    console.log(message.sender.username + " executed: Un-Mute against " + user.name);
                    bot.sendMessage(message, "Unmuted User " + user);
                  }
              } else {
                  bot.reply(message, "You need to mention someone!")
              }
          } else {
              bot.reply(message, "You do not have `Bot Commander` role")
          }
      }

    if (input.startsWith(prefix + "KICK")) {
        if (bot.memberHasRole(message.author, message.server.roles.get("name", "Bot Commander")) || isCommander.indexOf(message.sender.id) > -1) {
            if (message.mentions.length === 1) {
                for (var user of message.mentions) {
                    bot.kickMember(user, message.channel);
                    console.log(message.sender.username + " executed: kick against " + user.name);
                    bot.reply(message, "Kicked User" + user);
                  }
              } else {
                  bot.reply(message, "You need to mention someone!")
              }
          } else {
              bot.reply(message, "You do not have `Bot Commander` role")
          }
      }

        switch (input) {
            case (prefix) + "HELLO LILLY":
                bot.reply(message, "Hello My name is Lilly and I'm a Multi Bot. I was created by: Swiftly");
                break;

            case (prefix) + "SERVER":
                bot.reply(message, "Hello, Here is my Server Invite, https://discord.gg/SwiftlyGaming. :smile:");
                break;

                case "WHATSMYID":
                    bot.sendMessage(message, "Your ID is: `" + message.author.id + "`");
                    break;

            case (prefix) + "HELP":
                bot.reply(message, "Hello, Type $Commands if needed or any other help, Just join my Server, https://discord.gg/SwiftlyGaming. :smile:");
                break;

            case (prefix) + "DONATE":
                bot.sendMessage(message, "Donate here to support Lilly and Server Fees, Thanks :heart: https://wwww.paypal.me/SwiftlyG/5 or https://www.patreon.com/SwiftlyGaming");
                break;

            case (prefix) + "INVITE":
                bot.sendMessage(message, "Here is the invite link! https://discordapp.com/oauth2/authorize?client_id=207969547053957120&scope=bot&permissions=8");
                break;

            case (prefix) + "YOUTUBE":
                bot.sendMessage(message, "https://www.youtube.com/channel/UCqQRm9asEPPsd76LHdgKRdw");
                break;

            case "IM SWIFTLY":
                if (message.author.id == "150077952711852033") {
                  bot.sendMessage(message, "What can I do for you, Master?");
                }
                break;

        }
    });
