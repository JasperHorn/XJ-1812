
var Discord = require('discord.js');

exports.saveAttachments = saveAttachments;
exports.loadAttachments = loadAttachments;

var savedAttachments = [];

function saveAttachments(message, args) {
    savedAttachments = message.attachments.map(attachment => attachment.url);
    message.channel.send("I saved your attachments");
}

function loadAttachments(message, args) {
    var newAttachments = savedAttachments.map(url => new Discord.Attachment(url));

    if (savedAttachments.length > 0) {
        message.channel.send("These are the most recently saved attachments", { files: newAttachments });
    }
}
