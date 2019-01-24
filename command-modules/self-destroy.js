
var Utils = require('../utils.js');

var countdownCommand = {
    command: 'countdown',
    handler: countdown,
    includeInBasicHelp: false
};

var deleteThisCommand = {
    command: 'deletethis',
    handler: deleteThis,
    includeInBasicHelp: false
};

var selfDeletingMessageCommand = {
    command: 'selfdeletingmessage',
    handler: selfDeletingMessage,
    includeInBasicHelp: false
};

var selfDestructingMessageCommand = {
    command: 'selfdestructingmessage',
    handler: selfDestructingMessage,
    includeInBasicHelp: true
};

exports.name = "SelfDestroy";
exports.hidden = true;
exports.description = "A proof of concept I used to learn to manipulate messages";
exports.commands = [countdownCommand, deleteThisCommand, selfDeletingMessageCommand, selfDestructingMessageCommand];

function delay(time, value) {
   return new Promise(function(resolve) {
       setTimeout(resolve.bind(null, value), time)
   });
}

function countdown(message) {
    var args = message.content.split(' ');
    var timeout;

    if (args.length > 1) {
        timeout = parseInt(args[1]);
    }
    else {
        timeout = 5;
    }

    promisedCountdown(timeout, message.channel).then(function (countdownMessage) {
        countdownMessage.edit("Lift-off!");
    });
}

function promisedCountdown(startingAt, channel) {
    var timeout = startingAt;

    function updateMessage(ownMessage) {
        if (timeout > 0) {
            ownMessage.edit(getCurrentCount());
            return [true, ownMessage];
        }
        else {
            return [false, ownMessage];
        }
    }

    function getCurrentCount() {
        if (timeout > 10) {
            return Math.floor(timeout/ 10).toString() + "~";
        }
        else {
            return timeout.toString();
        }

        return ownMessage;
    }

    function updateLoop(ownMessage) {
        var delta;

        if (timeout <= 10) {
            delta = 1;
        }
        else {
            if (timeout % 10 == 9) {
                delta = 10;
            }
            else {
                delta = (timeout % 10) + 1;
            }

            if (timeout < 20) {
                delta--;
            }
        }

        timeout -= delta;

        return delay(1000 * delta, ownMessage).then(updateMessage).then(function (promiseArguments) {
            if (!promiseArguments[0]) {
                return promiseArguments[1];
            }
            else {
                return updateLoop(promiseArguments[1]);
            }
        });
    }

    return channel.send(getCurrentCount()).then(updateLoop);
}

function deleteThis(message) {
    message.delete();
}

function selfDeletingMessage(message) {
    delay(10000).then(function () {
        message.delete();
    });
}

function selfDestructingMessage(message) {
    var secretMessageText = message.content.replace('/selfdestructingmessage', Utils.authorNickname(message) + ':');
    message.delete();

    var secretMessage;

    message.channel.send(secretMessageText).then(function (ownMessage) {
        secretMessage = ownMessage;
        return promisedCountdown(10, message.channel);
    }).then(function (countdownMessage) {
        countdownMessage.delete();
        secretMessage.edit("Kaboom!");
    });
}
