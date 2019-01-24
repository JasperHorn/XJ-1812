//
// Part of XJ-1812
// License: MITA
//
var Utils = require('../utils.js');

var slapCommand = {
    rawCommand: '/slap',
    handler: slap,
    includeInBasicHelp: true
};

exports.name = "Slap";
exports.description = "A throwback to the IRC days";
exports.commands = [slapCommand];

function slap(message) {
    var response = '*' + Utils.authorNickname(message) + ' ';
    response += 'slaps'
    response += message.content.replace('/slap', '');
    response += ' around a bit with a large trout*'

    message.channel.send(response);
}
