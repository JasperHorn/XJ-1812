
var Discord = require('discord.js');

var saveAttachmentsCommand = {
    command: 'saveattachments',
    handler: saveAttachments,
    includeInBasicHelp: false
};

var loadAttachmentsCommand = {
    command: 'loadattachments',
    handler: loadAttachments,
    includeInBasicHelp: false
};

exports.commands = [saveAttachmentsCommand, loadAttachmentsCommand];

var savedAttachments = [];

function saveAttachments(message, args) {
    savedAttachments = message.attachments.map(attachment => attachment.url);
    message.channel.send("I saved your attachments");
}

function loadAttachments(message, args) {
    var newAttachments = savedAttachments.map(url => new Discord.MessageAttachment(url));

    if (savedAttachments.length > 0) {
        message.channel.send("These are the most recently saved attachments", { files: newAttachments });
    }
}
