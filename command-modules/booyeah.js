//
// Part of XJ-1812
// License: MITA
//
var booyeahCommand = {
    command: 'booyeah',
    handler: booyeah,
    includeInBasicHelp: true
};

exports.name = 'Booyeah';
exports.description = "A proof of concept based on using emoji reaction to interact with a bot";
exports.commands = [booyeahCommand];

function booyeah(message) {
    message.react("👍");
    message.react("👎");

    var collector = message.createReactionCollector((reaction, user) => reaction.emoji.name == "👍" || reaction.emoji.name == "👎");

    collector.on('collect', function (reaction) {
        var user = reaction.users.last();

        if (user != message.client.user) {
            if (reaction.emoji.name == '👍') {
                message.channel.send("Yeah!");
            }

            if (reaction.emoji.name == '👎') {
                message.channel.send("Boooh!");
            }

            reaction.users.remove(user);
        }
    });
}
