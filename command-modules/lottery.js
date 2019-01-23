
var Utils = require('../utils.js');

exports.randomPerson = randomPerson;

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPerson(message, args) {
    var guild = message.channel.guild;

    if (!guild) {
        message.channel.send("I pick you! Wait, there's nobody else to pick from, because you aren't asking me on a server...");
        return;
    }

    var filter = {
        statuses: [],
        roles: [],
        allowBots: false
    };

    var allStatuses = ['online', 'offline', 'idle', 'dnd'];
    var allRoles = guild.roles.map(role => role.name.toLowerCase());

    if (args.length > 1) {
        var rawFilter = args[1].split('|');

        rawFilter.forEach(function (singleFilter) {
            if (allStatuses.includes(singleFilter)) {
                filter.statuses.push(singleFilter);
            }
            else if (singleFilter == 'allowbots') {
                filter.allowBots = true;
            }
            else if (allRoles.includes(singleFilter.toLowerCase())) {
                filter.roles.push(singleFilter.toLowerCase());
            }
            else {
                message.channel.send('I do not understand what ' + singleFilter + " means, so I'm skipping it");
            }
        });
    }

    var people = guild.members.array();

    if (!filter.allowBots) {
        people = people.filter(member => !member.user.bot);
    }

    if (filter.statuses.length > 0) {
        people = people.filter(member => filter.statuses.includes(member.user.presence.status));
    }

    if (filter.roles.length > 0) {
        people = people.filter(member => member.roles.some(role => filter.roles.includes(role.name.toLowerCase())));
    }

    if (people.length == 0) {
        message.channel.send("Nobody to pick from!");
        return;
    }

    var personIndex = randomInteger(0, people.length - 1);
    var person = people[personIndex];

    message.channel.send("Randomly picked: " + Utils.nickname(guild, person.user));
}
