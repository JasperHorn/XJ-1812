
var Discord = require('discord.js');

var HelpMessage = require('./help-message.js');

module.exports = Bot;

function Bot(commandModules, config) {
    var self = this;

    self.run = run;

    var auth;
    var commands;
    var rawCommands;

    init();

    function init() {
        auth = config.auth;
        config.auth = undefined;

        HelpMessage.init(config, commandModules);

        commands = new Map();
        rawCommands = new Map();

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
    }

    function run() {
        var bot = new Discord.Client();

        bot.on('ready', function () {
            console.log('Connected');
            console.log('Logged in as: ');
            console.log(bot.user.username + ' - (' + bot.user.tag + ')');

            bot.user.setActivity(config.commandSequence + 'help');
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
    }
}
