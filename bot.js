var Discord = require('discord.js');
var auth = require('./auth.json');

// Initialize Discord Bot
var bot = new Discord.Client();

bot.on('ready', function () {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.user.username + ' - (' + bot.user.tag + ')');
    
    bot.user.setActivity('/xj-1812');
});

bot.on('message', function (message) {
    if (message.content.substring(0, 1) == '/') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
        
        switch(cmd) {
            case 'xj-1812':
                help(message, args);
                break;
            case 'slap':
                slap(message, args);
                break;
            case 'countdown':
                countdown(message, args);
                break;
            case 'deletethis':
                deleteThis(message, args);
                break;
            case 'selfdeletingmessage':
                selfDeletingMessage(message, args);
                break;
            case 'selfdestructingmessage':
                selfDestructingMessage(message, args);
                break;
            case 'roll':
                roll(message, args);
                break;
            case 'randomperson':
                randomPerson(message, args);
                break;
            case 'secret':
                secret(message, args);
                break;
            case 'revealsecret':
                revealSecret(message, args);
                break;
         }
     }
});

function delay(time, value) {
   return new Promise(function(resolve) { 
       setTimeout(resolve.bind(null, value), time)
   });
}

function nickname(guild, user) {
    var guildName = null;
    
    if (guild) {
        guildName = guild.member(user).nickname;
    }
    
    if (guildName !== null) {
        return guildName;
    }
    else {
        return user.username;
    }
}

function authorNickname(message) {
    return nickname(message.guild, message.author);
}

function help(message, args) {
    var response = 'Hi! My name is XJ-1812. I do things when you begin your message with one of the following: \n\
    /xj-1812 \n\
    /slap \n\
    /countdown \n\
    /deletethis \n\
    /selfdeletingmessage \n\
    /selfdestructingmessage \n\
    /roll <n>d<x> \n\
    /randomperson [<status|role|allowbots>[|...]] \n\
    /secret \n\
    /revealsecret \n\
    Feel free to experiment!';
    
    message.channel.send(response);
}

function slap(message, args) {    
    var response = '*' + authorNickname(message) + ' ';
    response += 'slaps'
    
    for (var i = 1; i < args.length; i++) {
        response += ' ' + args[i];
    }
    
    response += ' around a bit with a large trout*'
    
    message.channel.send(response);
}

function countdown(message, args) {
    var timeout;
    
    if (args.length > 1) {
        timeout = parseInt(args[1]);
    }
    else {
        timeout = 5;
    }
    
    promisedCountdown(timeout, message.channel).then(function (countdownMessage) {
        countdownMessage.edit("Lift-off!");
    });
}

function promisedCountdown(startingAt, channel) {
    var timeout = startingAt;
    
    function updateMessage(ownMessage) {
        if (timeout > 0) {
            ownMessage.edit(getCurrentCount());
            return [true, ownMessage];
        }
        else {
            return [false, ownMessage];
        }
    }
    
    function getCurrentCount() {
        if (timeout > 10) {
            return Math.floor(timeout/ 10).toString() + "~";
        }
        else {
            return timeout.toString();
        }
        
        return ownMessage;
    }
    
    function updateLoop(ownMessage) {
        var delta;
        
        if (timeout <= 10) {
            delta = 1;
        }
        else {
            if (timeout % 10 == 9) {
                delta = 10;
            }
            else {
                delta = (timeout % 10) + 1;
            }
            
            if (timeout < 20) {
                delta--;
            }
        }
        
        timeout -= delta;
        
        return delay(1000 * delta, ownMessage).then(updateMessage).then(function (promiseArguments) {
            if (!promiseArguments[0]) {
                return promiseArguments[1];
            }
            else {
                return updateLoop(promiseArguments[1]);
            }
        });
    }
    
    return channel.send(getCurrentCount()).then(updateLoop);
}

function deleteThis(message, args) {
    message.delete();
}

function selfDeletingMessage(message, args) {
    delay(10000).then(function () {
        message.delete();
    });
}

function selfDestructingMessage(message, args) {
    var secretMessageText = message.content.replace('/selfdestructingmessage', authorNickname(message) + ':');
    message.delete();
    
    var secretMessage;
    
    message.channel.send(secretMessageText).then(function (ownMessage) {
        secretMessage = ownMessage;
        return promisedCountdown(10, message.channel);
    }).then(function (countdownMessage) {
        countdownMessage.delete();
        secretMessage.edit("Kaboom!");
    });
}

function roll(message, args) {
    var dice;
    if (args.length > 1) {
        dice = args[1].split('d', 2);
    }
    else {
        dice = [];
    }
    
    var count = parseInt(dice[0]);
    var dieType = parseInt(dice[1]);
    
    if (isNaN(count) || count <= 0) {
        count = 1;
    }
    
    if (count > 20) {
        count = 20;
    }
    
    if (isNaN(dieType) || dieType <= 0) {
        dieType = 6;
    }
    
    function dieRoll(sides) {
        return randomInteger(1, sides);
    }
    
    var results = [];
    for (var i = 0; i < count; i++) {
        results.push(dieRoll(dieType));
    }
    
    var output = "Rolled " + count.toString() + "d" + dieType.toString() + ": ";
    output += results.reduce((a, b) => a + b, 0);
    
    if (count > 1) {
        output += ' (';
        output += results.reduce((a, b) => a.toString() + ", " + b.toString());
        output += ')';
    }
    
    message.channel.send(output);
}

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
    
    message.channel.send("Randomly picked: " + nickname(guild, person.user));
}

var secrets = new Map();

function generateUniqueRandomKey() {
    var key;
    
    do {
        key = Math.random().toString().substring(2, 10);
    } while (secrets.has(key));
    
    return key;
}

function secret(message, args) {
    if (args.length < 2) {
        message.channel.send("Please provide me with a secret to keep.");
        return;
    }
    
    if (message.channel.type != 'dm') {
        message.channel.send("You've got to tell me your secret in private, silly. Otherwise it's not a secret.");
        return;
    }
    
    var key = generateUniqueRandomKey();
    var secret = message.content.replace('/secret ', '');
    
    secrets.set(key, { message: secret });
    message.channel.send("Your secret has been stored under the key " + key);
}

function revealSecret(message, args) {
    if (args.length < 2) {
        message.channel.send("Please specify the key of the secret you wish me to reveal.");
        return;
    }
    
    if (message.channel.type == 'dm') {
        message.channel.send("I can't reveal a secret to just one person.");
        return;
    }
    
    var key = args[1];
    
    if (secrets.has(key)) {
        message.channel.send("The secret is: " + secrets.get(key).message);
        message.channel.send("Since the secret has been revealed, I will stop keeping it.");
        
        secrets.delete(key);
    }
    else {
        message.channel.send("No secret by that key is known to me");
    }
}

bot.login(auth.token);