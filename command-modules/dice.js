
var rollCommand = {
    command: 'roll',
    handler: roll,
    usageHint: '<n>d<x>',
    includeInBasicHelp: true
};

exports.name = "Dice";
exports.description = "A simple dice roller";
exports.commands = [rollCommand];

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function roll(message) {
    var args = message.content.split(' ');
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
