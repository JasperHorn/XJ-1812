var Discord = require('discord.js');
var config = require('./config.json');

var auth = config.auth;
config.auth = undefined;

var HelpMessage = require('./help-message.js');

var commandModules = [];

commandModules.push(require('./command-modules/sqlpoc.js'));
commandModules.push(require('./command-modules/store-image.js'));
commandModules.push(require('./command-modules/booyeah.js'));
commandModules.push(require('./command-modules/slap.js'));
commandModules.push(require('./command-modules/self-destroy.js'));
commandModules.push(require('./command-modules/dice.js'));
commandModules.push(require('./command-modules/lottery.js'));
commandModules.push(require('./command-modules/secret-messages.js'));
commandModules.push(require('./command-modules/save-attachments.js'));

// Initialize Discord Bot
var bot = new Discord.Client();

bot.on('ready', function () {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.user.username + ' - (' + bot.user.tag + ')');

    bot.user.setActivity(config.commandSequence + 'help');
});

HelpMessage.init(config, commandModules);

var commands = new Map();
var rawCommands = new Map();

commandModules.forEach(function (commandModule) {
    if (commandModule.init) {
        commandModule.init(config);
    }

    commandModule.commands.forEach(function (command) {
        if (command.command) {
            commands.set(command.command, command);
        }

        if (command.rawCommand) {
            rawCommands.set(command.rawCommand, command);
        }
    });
});

bot.on('message', function (message) {
    var firstWord = message.content.split(' ', 1)[0];

    if (rawCommands.has(firstWord)) {
        rawCommands.get(firstWord).handler(message);
    }
    else if (firstWord.substring(0, config.commandSequence.length) == config.commandSequence) {
        var cmd = firstWord.substring(config.commandSequence.length);

        if (cmd == 'help') {
            HelpMessage.helpMessage(message);
        }
        else if (commands.has(cmd)) {
            commands.get(cmd).handler(message);
        }
     }
});

bot.on('error', console.log);

bot.login(auth.token);
