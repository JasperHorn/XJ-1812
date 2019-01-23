
exports.nickname = nickname;
exports.authorNickname = authorNickname;

function nickname(guild, user) {
    var guildName = null;

    if (guild) {
        var member = guild.member(user);

        if (member) {
            guildName = member.nickname;
        }
    }

    if (guildName) {
        return guildName;
    }
    else {
        return user.username;
    }
}

function authorNickname(message) {
    return nickname(message.guild, message.author);
}
