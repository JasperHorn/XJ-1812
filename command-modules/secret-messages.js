//
// Part of XJ-1812
// License: MITA
//
var Utils = require('../utils.js');

var secretCommand = {
    command: 'secret',
    handler: secret,
    includeInBasicHelp: true
};

var revealSecretCommand = {
    command: 'revealsecret',
    handler: revealSecret,
    includeInBasicHelp: false
};

var peekAtSecretCommand = {
    command: 'peekatsecret',
    handler: peekAtSecret,
    includeInBasicHelp: false
};

exports.name = "SecretMessages";
exports.description = "Store a secret, let people peak at the secret, and finally reveal it";
exports.commands = [secretCommand, revealSecretCommand, peekAtSecretCommand];
exports.init = init;

var commandSequence;

function init(config) {
    commandSequence = config.commandSequence;
}

var secrets = new Map();

function generateRandomKey() {
    return Math.random().toString().substring(2, 10);
}

function generateUniqueRandomKey() {
    var key;

    do {
        key = generateRandomKey();
    } while (secrets.has(key));

    return key;
}

function secret(message) {
    var args = message.content.split(' ');
    if (args.length < 2) {
        message.channel.send("Please provide me with a secret to keep.");
        return;
    }

    if (message.channel.type != 'dm') {
        message.channel.send("You've got to tell me your secret in private, silly. Otherwise it's not a secret.");
        return;
    }

    var key = generateUniqueRandomKey();
    var secretMessage = message.content.replace(commandSequence + 'secret ', '');

    var secret = {
        message: secretMessage,
        author: message.author,
        creationDate: Date.now(),
        revealKey: generateRandomKey(),
        verificationKey: generateRandomKey(),
        peekers: []
    };

    secrets.set(key, secret);

    var revealKey = key + '|' + secret.revealKey;

    message.channel.send("I'm now keeping your secret");
    message.channel.send("Its peek key is " + key + ". Those who have this key can peek " +
        "at the secret by writing `" + commandSequence + "peekatsecret " + key + "` in a DM to me. It will be recorded " +
        "who peeked at the secret, and revealing or peaking at the secret will reveal who peeked at it.");
    message.channel.send("Its reveal key is " + revealKey + ". Those who have this key can reveal " +
        "the secret by writing `" + commandSequence + "revealsecret " + revealKey + "` in any channel on a server I'm on. " +
        "After revealing the secret, I will forget it.");
    message.channel.send("Its verification key is " + secret.verificationKey + ". " +
        "Having the verification key does not give access to the secret. However, by publishing " +
        "it now, you can later prove that you didn't just make multiple secrets and picked which " +
        "one to reveal later on.");
}

function millisToInterval(millis) {
    var seconds = millis / 1000;
    if (seconds < 60) {
        return Math.floor(seconds) + (seconds < 2 ? " second" : " seconds");
    }

    var minutes = seconds / 60;
    if (minutes < 60) {
        return Math.floor(minutes) + (minutes < 2 ? " minute" : " minutes");
    }

    var hours = minutes / 60;
    if (hours < 24) {
        return Math.floor(hours) + (hours < 2 ? " hour" : " hours");
    }

    var days = hours / 24;
    return Math.floor(days) + (days < 2 ? " day" : " days");
}

function sendSecret(secret, channel) {
    channel.send("The secret is: " + secret.message);
    channel.send("Its verification key is: " + secret.verificationKey);
    channel.send("I was entrusted with this secret by " +
        Utils.nickname(channel.guild, secret.author) +
        " " + millisToInterval(Date.now() - secret.creationDate) + " ago");
    if (secret.peekers.length == 0) {
        channel.send("Nobody has peeked at the secret.");
    }
    else {
        channel.send("The secret was peeked at by: " +
            secret.peekers.map(user => Utils.nickname(channel.guild, user))
                .reduce((usersSoFar, user) => usersSoFar + ', ' + user));
    }
}

function revealSecret(message) {
    var args = message.content.split(' ');
    if (args.length < 2) {
        message.channel.send("Please specify the key of the secret you wish me to reveal.");
        return;
    }

    if (message.channel.type == 'dm') {
        message.channel.send("I can't reveal a secret to just one person. You can peek at the secret instead.");
        return;
    }

    var keys = args[1].split('|');
    var key = keys[0];

    if (keys.length < 2) {
        message.channel.send("You need the full reveal key to reveal a secret. " +
            "What you sent looks like a peek key, with which you can only " +
            "peek at the secret.")
        return;
    }
    else if (secrets.has(key) && secrets.get(key).revealKey == keys[1]) {
        var secret = secrets.get(key);

        sendSecret(secret, message.channel);
        message.channel.send("Since the secret has been revealed, I will stop keeping it.");

        secrets.delete(key);
    }
    else {
        message.channel.send("No secret by that key is known to me");
    }
}

function peekAtSecret(message) {
    var args = message.content.split(' ');
    if (message.channel.type != 'dm') {
        message.channel.send("You can only peek at secrets in private.");
        return;
    }

    if (args.length < 2) {
        message.channel.send("Please specify the key of the secret you wish to peek at.");
        return;
    }

    var key = args[1].split('|')[0];

    if (secrets.has(key)) {
        var secret = secrets.get(key);

        sendSecret(secret, message.channel);

        if (!secret.peekers.includes(message.author) && message.author != secret.author) {
            secret.peekers.push(message.author);
        }
    }
    else {
        message.channel.send("No secret by that key is known to me");
    }
}
