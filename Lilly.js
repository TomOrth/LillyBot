var Discord = require("discord.js");
var mysql = require('mysql');
var bot = new Discord.Client();
var prefix = "$"
var unirest = require('unirest')
fs = require('fs')
fs.readFile('token.txt', 'utf8', function (err,token) {
if (err) {
return console.log(err);
}
bot.loginWithToken(token);
});

var connection = mysql.createConnection({
host: "localhost",
user: "LillyBot",
password: "Bubblegum13",
database: "LillyBott"
});
connection.connect();

bot.on('ready', function () {
  console.log('Bot online and ready On ' + bot.servers.length + " servers");
  bot.setPlayingGame('V.1.4 | ' + bot.servers.length + " Servers")
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
                })
            });

            bot.on("serverDeleted", function (server) {
                console.log("Attempting to remove " + server.name + " from the database!");
                connection.query("DELETE FROM servers WHERE serverid = '" + server.id + "'", function (error) {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    console.log("Server Removed!");
                })
            });

            const banWords = require("./filterwords.json").filterword;

            var isCommander = ["150077952711852033"];

            bot.on("message", function(message) {
            	if(message.server.id === "150294997571207168"){
            		banWords.forEach((filterword, index, array) => {
            		if (bot.memberHasRole(message.author, message.server.roles.get("name", "Bot Commander")) || isCommander.indexOf(message.sender.id) > -1) {
            			if (message.content.includes(filterword)) {
            				console.log(message.author.id + " Said a bad word: " + message.content);
            				bot.reply(message, "one or more of the words you used in that sentence are not allowed here.");
            				message.delete();
            				return;
            				}
            			}
            		})
            	}
            })

            bot.on("message", function(message) {
              if (message.content.startsWith(prefix + "Medals")) {
                let Country = message.content.replace((prefix + "Medals"), '').trimLeft();
                unirest.get('http://www.medalbot.com/api/v1/medals/'+Country)
                .end(res => {
              var d = res.body;
              if(d.country_name)
                 bot.sendMessage(message, `**${message.author.username}** : **__${d.country_name}'s__** Total Olympic Medal Count: \`${d.total_count}\` `);
              else {
                 bot.sendMessage(message, `**${message.author.username}** : **That Country has no Medals** or Use $Spelling`);
                 }
                })
              }
            });

bot.on('serverNewMember', function(server, user)
{
     bot.sendMessage(server.name, ":wave: " + user.username + " joined the server.");
      if (server.id === "150294997571207168")
          bot.sendMessage(server.name,"Welcome " + user.username + " to Lilly Lounge! | If you need help with anything you can for support in <#217295164576759810> | Please do not ask in <#150294997571207168>. Also read <#173915068965191681>");
           bot.addMemberToRole(user.id, server.roles.get("name", "Member"));
            bot.sendMessage("Join Role -> ``Member`` given to " + user.username);
            });

            bot.on("message", msg => {
               if (msg.content === (prefix) + "commands") {
                bot.sendMessage(msg.author, "Available Commands: :one: $Hello Lilly :two: $Help :three: $Donate :four: $Invite :five: $Server");
              }
            });

            bot.on("message", function (message) {
                if (!message.channel.isPrivate) {
                    if (message.content === (prefix) + "ping") {
                        var start = new Date(message.timestamp).getTime();
                        bot.sendMessage(message, "Pong!", (error, botMessage) => {
                            var end = new Date(botMessage.timestamp).getTime();
                            bot.updateMessage(botMessage, "Pong! | took " + (end - start) + "ms.");
                        });
                    }

                    if (message.content.indexOf("prefix") === 0) {
                        var command = message.substr(prefix.length);
                      }
                } else {
                    switch (message.content) {
                      bot.sendMessage(message, "Pong! You're on **PM**");
                      break;
                    }
                  }

	else if(message.content.startsWith (prefix + "ban")) {
	if(message.content.startsWith (prefix + "ban")) {
    if (bot.memberHasRole(message.author, message.server.roles.get("name", "Bot Commander")) || isCommander.indexOf(message.sender.id) > -1)
    {
      if(msg.mentions.length === 1){
        for(var user of msg.mentions){
          bot.banMember(user, msg.channel);
          console.log(message.sender.username + " executed: ban against " + user.name);
          bot.reply(message, user + " has been banned.");
          return;
        }}
      }
      else
      {
        bot.reply(message, "You don't have permissions.");
      }
    }

else if(message.content.startsWith (prefix + "kick")) {
if (bot.memberHasRole(message.author, message.server.roles.get("name", "Bot Commander")) || isCommander.indexOf(message.sender.id) > -1)
{
    if(msg.mentions.length === 1){
    for(var user of msg.mentions){
        bot.kickMember(user, msg.channel);
        console.log(cmand(message.sender.username + " executed: kick against " + user.name));
        bot.reply(message, user + " has been kicked.");
        return;
    }}
}
else
{
    bot.reply(message, "You don't have permissions");
}
}
            var input = message.content.toUpperCase();

                  switch (input) {
                     case  (prefix) + "HELLO LILLY":
                        bot.reply(message, "Hello My name is Lilly and I'm a Multi Bot. I was created by: Swiftly");
                          break;

                     case  (prefix) + "SPELLING":
                          bot.reply(message, "Hello, For the Medals Command it must be $Medals 'lower case country'");
                          break;

                      case  (prefix) + "SERVER":
                            bot.reply(message, "Hello, Here is my Server Invite, https://discord.gg/SwiftlyGaming. :smile:");
                            break;

                      case  (prefix) + "HELP":
                        bot.reply(message, "Hello, Type $Commands if needed or any other help, Just join my Server, https://discord.gg/SwiftlyGaming. :smile:");
                        break;

                      case  (prefix) + "DONATE":
                        bot.sendMessage(message, "Donate here to support Lilly and Server Fees, Thanks :heart: https://wwww.paypal.me/SwiftlyG/5 or https://www.patreon.com/SwiftlyGaming");
                        break;

                    case (prefix) + "INVITE":
                       bot.sendMessage(message, "Here is the invite link! https://discordapp.com/oauth2/authorize?client_id=207969547053957120&scope=bot&permissions=8");
                       break;

                    case "FAILFISH":
                       bot.sendFile(message, "https://cdn.discordapp.com/attachments/156239548781690880/213012982005891079/FailFish.png");
                       break;

            if (message.author.id !== "150077952711852033") { works;}
                    case "I'M SWIFTLY":
                        bot.sendMessage(message, "What can I do for you, Master?");
                        break;

            if (message.author.id !== "150077952711852033") { works;}
                    case (prefix) + "I'M LIVE":
                        bot.sendMessage(message, "I'm Live, Come watch me, https://wwww.twitch.tv/swiftly__gaming");
                        break;

                }
            });
