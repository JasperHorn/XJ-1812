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
    usageHint: '<scoreboard> <user> [+|-|=]<score>',
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
        var response = "**Scoreboard " + name + "**\n";
        response += '\n';

        var scoreboard = scoreboards.get(name);

        if (scoreboard.size == 0)
        {
            response += "No participants yet.";
        }
        else
        {
            function compareKeyValue(pair1, pair2)
            {
                return pair2[1] - pair1[1];
            }
            var scores = Array.from(scoreboard.entries()).sort(compareKeyValue);

            scores.forEach(function (keyValuePair, rank)
            {
                response += '#';
                response += (rank + 1);
                response += ': **';
                response += keyValuePair[0];
                response += '** (*';
                response += keyValuePair[1];
                response += ' points*)';
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

    var regex = /^(\\+|-|=)?(.*)$/;
    var scoreOperation = regex.exec(args[3]);

    var scoreboard = args[1];
    var user = args[2];
    var operation = scoreOperation[1];
    var score = parseInt(scoreOperation[2], 10);

    if (!scoreboards.has(scoreboard)) {
        message.channel.send("There is no scoreboard named " + scoreboard + ".");
        return;
    }

    if (isNaN(score)) {
        message.channel.send("Score needs to be a number.");
        return;
    }

    if (!scoreboards.get(scoreboard).has(user))
    {
        scoreboards.get(scoreboard).set(user, 0);
    }

    if (operation == '+' || operation == undefined)
    {
        score += scoreboards.get(scoreboard).get(user);
    }
    else if (operation == '-')
    {
        score = scoreboards.get(scoreboard).get(user) - score;
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
