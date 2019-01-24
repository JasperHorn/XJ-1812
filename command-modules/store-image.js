
var Sequelize = require('Sequelize');
var Discord = require('discord.js');

var storeImageCommand = {
    command: 'storeimage',
    handler: storeImage,
    includeInBasicHelp: true
};

var loadImageCommand = {
    command: 'loadimage',
    handler: loadImage,
    includeInBasicHelp: true
};

var deleteImageCommand = {
    command: 'deleteimage',
    handler: deleteImage,
    includeInBasicHelp: true
};

var listImageKeysCommand = {
    command: 'listimagekeys',
    handler: listImageKeys,
    includeInBasicHelp: true
};

exports.name = "StoreImage";
exports.commands = [storeImageCommand, loadImageCommand, deleteImageCommand, listImageKeysCommand];

var database = new Sequelize('sqlite:storeimage.db');

var Message = database.define('message', {
    key: { type: Sequelize.STRING, unique: true }
});

var Attachment = database.define('attachment', {
    url: Sequelize.STRING
});

Message.hasMany(Attachment, { as: 'Attachments'});

database.sync();

function storeImage(message, args) {
    if (args.length < 2) {
        message.channel.send("You need to provide a key to store the image under");
        return;
    }

    if (message.attachments.size == 0) {
        message.channel.send("You need to attach the image to the command message");
        return;
    }

    if (args.length > 2) {
        message.channel.send("Please specify only the key to store the image under");
        return;
    }

    var key = args[1];

    var attachmentsPromise = Promise.all(message.attachments.map(attachment => Attachment.create({ url: attachment.url })));

    var databaseMessage;

    Message.create({ key: key }).then(function (savingMessage) {
        databaseMessage = savingMessage;
        return attachmentsPromise;
    }).then(function (attachments) {
        return databaseMessage.setAttachments(attachments);
    }).then(function () {
        message.channel.send("I stored your image under the key " + key);
    }).catch(function (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            message.channel.send("There's already an image with that key");
        }
        else {
            message.channel.send("Something went wrong and your image was not saved");
            console.log(error.stack);
        }
    });
}

function loadImage(message, args) {
    if (args.length < 2) {
        message.channel.send("You need to specify the key of the image you want me to retrieve");
        return;
    }

    if (args.length > 2) {
        message.channel.send("Please specify only the key of the image that you want me to retrieve");
        return;
    }

    var key = args[1];

    Message.findOne({
        where: { key: key }
    }).then(function (resultMessage) {
        if (resultMessage != null) {
            resultMessage.getAttachments().then(function (attachments) {
                var newAttachments = attachments.map(attachment => new Discord.MessageAttachment(attachment.url));
                message.channel.send("Here you go!", { files: newAttachments });
            });
        }
        else {
            message.channel.send("There is no image with that key");
        }
    });
}

function deleteImage(message, args) {
    if (args.length < 2) {
        message.channel.send("You need to specify the key of the image you want me to delete");
        return;
    }

    if (args.length > 2) {
        message.channel.send("Please specify only the key of the image that should be deleted");
        return;
    }

    var key = args[1];

    Message.findOne({
        where: { key: key }
    }).then(function (resultMessage) {
        if (resultMessage != null) {
            resultMessage.getAttachments().then(function (attachments) {
                var promises = [];

                attachments.forEach(function (attachment) {
                    promises.push(attachment.destroy());
                });
                promises.push(resultMessage.destroy());

                Promise.all(promises).then(function () {
                    message.channel.send("Deleted the image under that key");
                });
            });
        }
        else {
            message.channel.send("There is no image with that key");
        }
    });
}

function listImageKeys(message, args) {
    Message.findAll().then(function (messages) {
        if (messages.length > 0) {
            message.channel.send("I have images with these keys: " +
                messages.map(message => message.key).join(','));
        }
        else {
            message.channel.send("I do not have any images at the moment");
        }
    });
}
