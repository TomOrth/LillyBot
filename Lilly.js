var Discord = require("discord.js");
var mysql = require('mysql');
var bot = new Discord.Client();
var prefix = "$"
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
    database: "LillyBot"
});
connection.connect();

bot.on('ready', function () {
    console.log('Bot online and ready On ' + bot.servers.length + " servers");
    bot.setPlayingGame('Use $help | ' + bot.servers.length + " Servers")
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

bot.on("msg", function(message) {
if(msg.mentions.length === 1){
            for(var user of msg.mentions){
                bot.banMember(user, msg.channel);
                bot.sendMessage(msg.channel, "Banned, " + user);
                return;
               }
              }
            })

bot.on('serverNewMember', function(server, user)
{
        bot.sendMessage(server.name, ":wave: " + user.username + " joined the server.");
        if(server.id === "150294997571207168")
                 bot.addMemberToRole(user.id, server.roles.get("name", "Member"));
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
            case (prefix) + "ping":
                bot.sendMessage(message, "Pong! Your on **PM**");
                break;
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

if (message.author.id !== "150077952711852033") { works;}
        case "I'M SWIFTLY":
            bot.sendMessage(message, "What can I do for you, Master?");
            break;

if (message.author.id !== "150077952711852033") { works;}
        case (prefix) + "I'M LIVE":
            bot.sendMessage(message, "I'm Live, Come watch me, https://wwww.twitch.tv/swiftly__gaming");
            break;

        case "MINGLEE":
            sendFile(message, "https://cdn.discordapp.com/attachments/195671480770494464/213013487830433793/MingLee.png");
            break;

        case "KAPPA":
            bot.sendFile(message, "https://cdn.discordapp.com/attachments/195671480770494464/213013488006594560/Kappa.png");
            break;

        case "FAILFISH":
            bot.sendFile(message, "https://cdn.discordapp.com/attachments/156239548781690880/213012982005891079/FailFish.png");
            break;
    }
});
