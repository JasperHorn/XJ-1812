//
// Part of XJ-1812
// License: MITA
//
var Utils = require('../utils.js');

var scoreboardCommand = {
    command: 'scoreboard',
    handler: scoreboard,
    usageHint: '<scoreboard>',
    includeInBasicHelp: true
};

var scoreCommand = {
    command: 'score',
    handler: score,
    usageHint: '<scoreboard> <user> <score>',
    includeInBasicHelp: true
};

exports.name = "Scoreboard";
exports.description = "Keep score between a number of parties";
exports.commands = [scoreboardCommand, scoreCommand];

var scoreboards = new Map();

function scoreboard(message) {
    var args = message.content.split(' ');
    if (args.length < 2) {
        message.channel.send("Please tell me which scoreboard you want to see.");
        return;
    }

    if (args.length > 2) {
        message.channel.send("The scoreboard name needs to be one word.");
        return;
    }

    var name = args[1];

    if (scoreboards.has(name))
    {
        var response = "Scoreboard " + name + "\n";
        response += '\n';

        var scoreboard = scoreboards.get(name);

        if (scoreboard.size == 0)
        {
            response += "No participants yet.";
        }
        else
        {
            scoreboard.forEach(function (value, key)
            {
                response += key;
                response += ': ';
                response += value;
                response += '\n';
            });
        }

        message.channel.send(response);
    }
    else
    {
        scoreboards.set(name, new Map());
        message.channel.send("Scoreboard " + name + " has been created");
    }
}

function score(message)
{
    var args = message.content.split(' ');
    if (args.length != 4) {
        var response = "Please follow the correct format to set a score: ";
        response += scoreCommand.usageHint;
        response += ".";
        message.channel.send(response);
        return;
    }

    var scoreboard = args[1];
    var user = args[2];
    var score = parseInt(args[3], 10);

    if (!scoreboards.has(scoreboard)) {
        message.channel.send("There is no scoreboard named " + scoreboard + ".");
        return;
    }

    if (isNaN(score)) {
        message.channel.send("Score needs to be a number.");
        return;
    }

    scoreboards.get(scoreboard).set(user, score);

    var response = user;
    response += " now has ";
    response += score;
    response += " points on scoreboard ";
    response += scoreboard;
    response += ".";

    message.channel.send(response);
}
