
exports.booyeah = booyeah;

function booyeah(message, args) {
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
