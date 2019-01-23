
var Sequelize = require('Sequelize');

var sqlStoreCommand = {
    command: 'sqlstore',
    handler: sqlStore,
    includeInBasicHelp: false
};

var sqlReadCommand = {
    command: 'sqlread',
    handler: sqlRead,
    includeInBasicHelp: false
};

var sqlDeleteCommand = {
    command: 'sqldelete',
    handler: sqlDelete,
    includeInBasicHelp: false
};

exports.commands = [sqlStoreCommand, sqlReadCommand, sqlDeleteCommand];

var database = new Sequelize('sqlite:sqlpoc.db');

var Message = database.define('message', {
    key: Sequelize.STRING,
    contents: Sequelize.TEXT
});

database.sync();

function sqlStore(message, args) {
    if (args.length < 3) {
        message.channel.send("You need to specify both a key and a message to store under that key");
        return;
    }

    var key = args[1];
    var text = args.slice(2).join(' ');

    var savingMessage = { key: key, contents: text };
    Message.findOrCreate({
        where: { key: key },
        defaults: savingMessage
    }).then(function (resultMessageAndCreated) {
        var created = resultMessageAndCreated[1];
        if (created) {
            message.channel.send("I stored your message under the key " + key);
        }
        else {
            message.channel.send("There's already a message stored under that key!");
        }
    });
}

function sqlRead(message, args) {
    if (args.length < 2) {
        message.channel.send("You need to specify the key of the message you want me to retrieve");
        return;
    }

    if (args.length > 2) {
        message.channel.send("More content found than expected, ignoring everything after the key");
    }

    var key = args[1];

    Message.findOne({
        where: { key: key }
    }).then(function (resultMessage) {
        if (resultMessage != null) {
            message.channel.send("The message for that key is: " + resultMessage.contents);
        }
        else {
            message.channel.send("There is no message with that key");
        }
    });
}

function sqlDelete(message, args) {
    if (args.length < 2) {
        message.channel.send("You need to specify the key of the message you want me to delete");
        return;
    }

    if (args.length > 2) {
        message.channel.send("More content found than expected, ignoring everything after the key");
    }

    var key = args[1];

    Message.findOne({
        where: { key: key }
    }).then(function (resultMessage) {
        if (resultMessage != null) {
            message.channel.send("Deleting the message under that key");
            resultMessage.destroy();
        }
        else {
            message.channel.send("There is no message with that key");
        }
    });
}
