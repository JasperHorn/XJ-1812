var Discord = require('discord.js');
var config = require('./config.json');

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

    bot.user.setActivity('/help');
});

var commands = new Map();

commandModules.forEach(function (commandModule) {
    commandModule.commands.forEach(function (command) {
        commands.set(command.command, command);
    });
});

bot.on('message', function (message) {
    if (message.content.substring(0, 1) == '/') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];

        if (cmd == 'help') {
            help(message);
        }
        else if (commands.has(cmd)) {
            commands.get(cmd).handler(message);
        }
     }
});

bot.on('error', console.log);

function help(message) {
    var response = "Hi! My name is " + config.name + " and I'm a bot. React with 🤖 to learn more.";

    message.channel.send(response).then(function (myMessage) {
        myMessage.react("🤖");

        var collector = myMessage.createReactionCollector((reaction, user) => reaction.emoji.name == "🤖");

        collector.on('collect', function (reaction) {
            var user = reaction.users.last();

            if (user != message.client.user) {
                basicHelp(user);
            }
        });
    });
}

function basicHelp(user) {
    response = "These are some of the commands I respond to: \n\n";

    commands.forEach(function (command) {
        if (command.includeInBasicHelp) {
            response += commandHelpText(command);
            response += '\n';
        }
    });

    response += '\nFeel free to experiment!';

    response += ' \n\nReact with 📢 to see more commands as well as the command modules loaded';

    user.send(response).then(function (myMessage) {
        myMessage.react("📢");

        var collector = myMessage.createReactionCollector((reaction, user) => reaction.emoji.name == "📢", { max: 2 });

        collector.on('collect', function (reaction) {
            var user = reaction.users.last();

            if (user != user.client.user) {
                listModules(user);
            }
        });
    });
}

function listModules(user) {
    var response = "These are the command modules I have loaded: \n";

    commandModules.forEach(function (commandModule) {
        if (!commandModule.hidden) {
            response += "\n";
            response += moduleHelpText(commandModule);
        }
    });

    response += ' \n\nReact with 👀 to see any hidden command modules';

    user.send(response).then(function (message) {
        message.react("👀");

        var collector = message.createReactionCollector((reaction, user) => reaction.emoji.name == "👀", { max: 2 });

        collector.on('collect', function (reaction) {
            var user = reaction.users.last();

            if (user != user.client.user) {
                listHiddenModules(user);
            }
        });
    });
}

function listHiddenModules(user) {
    var response = "These are the hidden command modules I have loaded: \n";

    commandModules.forEach(function (commandModule) {
        if (commandModule.hidden) {
            response += "\n";
            response += moduleHelpText(commandModule);
        }
    });

    user.send(response);
}

function moduleHelpText(commandModule) {
    var output = "The " + commandModule.name + " module: \n";
    output += commandModule.description + "\n";

    commandModule.commands.forEach(function (command) {
        output += commandHelpText(command);
        output += '\n';
    });

    return output;
}

function commandHelpText(command) {
    var output = '/' + command.command;

    if (command.usageHint) {
        output += ' ' + command.usageHint;
    }

    return output;
}

bot.login(config.auth.token);
