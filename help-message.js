
exports.helpMessage = helpMessage;
exports.init = init;

var commandModules;
var commandSequence;
var name;

function init(config, theCommandModules) {
    commandModules = theCommandModules;

    commandSequence = config.commandSequence;
    name = config.name;
}

function helpMessage(message) {

    var response = "Hi! My name is " + name + " and I'm a bot. React with 🤖 to learn more.";

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

    commandModules.forEach(function (commandModule) {
        commandModule.commands.forEach(function (command) {
            if (command.includeInBasicHelp) {
                response += commandHelpText(command);
                response += '\n';
            }
        });
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
    var output;

    if (command.rawCommand) {
        output = command.rawCommand;
    }
    else {
        output = commandSequence + command.command;
    }

    if (command.usageHint) {
        output += ' ' + command.usageHint;
    }

    return output;
}
