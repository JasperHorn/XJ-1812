
var Utils = require('../utils.js');

var slapCommand = {
    command: 'slap',
    handler: slap,
    includeInBasicHelp: true
};

exports.name = "Slap";
exports.commands = [slapCommand];

function slap(message, args) {
    var response = '*' + Utils.authorNickname(message) + ' ';
    response += 'slaps'

    for (var i = 1; i < args.length; i++) {
        response += ' ' + args[i];
    }

    response += ' around a bit with a large trout*'

    message.channel.send(response);
}
