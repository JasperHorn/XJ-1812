var Discord = require('discord.js');
var auth = require('./auth.json');

var SqlPoC = require('./command-modules/sqlpoc.js');
var StoreImage = require('./command-modules/store-image.js');
var Booyeah = require('./command-modules/booyeah.js');
var Slap = require('./command-modules/slap.js');
var SelfDestroy = require('./command-modules/self-destroy.js');
var Dice = require('./command-modules/dice.js');
var Lottery = require('./command-modules/lottery.js');
var SecretMessages = require('./command-modules/secret-messages.js');
var SaveAttachments = require('./command-modules/save-attachments.js');

// Initialize Discord Bot
var bot = new Discord.Client();

bot.on('ready', function () {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.user.username + ' - (' + bot.user.tag + ')');

    bot.user.setActivity('/xj-1812');
});

bot.on('message', function (message) {
    if (message.content.substring(0, 1) == '/') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];

        switch(cmd) {
            case 'xj-1812':
                help(message, args);
                break;
            case 'slap':
                Slap.slap(message, args);
                break;
            case 'countdown':
                SelfDestroy.countdown(message, args);
                break;
            case 'deletethis':
                SelfDestroy.deleteThis(message, args);
                break;
            case 'selfdeletingmessage':
                SelfDestroy.selfDeletingMessage(message, args);
                break;
            case 'selfdestructingmessage':
                SelfDestroy.selfDestructingMessage(message, args);
                break;
            case 'roll':
                Dice.roll(message, args);
                break;
            case 'randomperson':
                Lottery.randomPerson(message, args);
                break;
            case 'secret':
                SecretMessages.secret(message, args);
                break;
            case 'revealsecret':
                SecretMessages.revealSecret(message, args);
                break;
            case 'peekatsecret':
                SecretMessages.peekAtSecret(message, args);
                break;
            case 'saveattachments':
                SaveAttachments.saveAttachments(message, args);
                break;
            case 'loadattachments':
                SaveAttachments.loadAttachments(message, args);
                break;
            case 'sqlstore':
                SqlPoC.sqlStore(message, args);
                break;
            case 'sqlread':
                SqlPoC.sqlRead(message, args);
                break;
            case 'sqldelete':
                SqlPoC.sqlDelete(message, args);
                break;
            case 'storeimage':
                StoreImage.storeImage(message, args);
                break;
            case 'readimage':
                StoreImage.readImage(message, args);
                break;
            case 'deleteimage':
                StoreImage.deleteImage(message, args);
                break;
            case 'listimagekeys':
                StoreImage.listImageKeys(message, args);
                break;
            case 'booyeah':
                Booyeah.booyeah(message, args);
                break;

         }
     }
});

bot.on('error', console.log);

function help(message, args) {
    var response = 'Hi! My name is XJ-1812. I do things when you begin your message with one of the following: \n\
    /xj-1812 \n\
    /slap \n\
    /countdown \n\
    /deletethis \n\
    /selfdeletingmessage \n\
    /selfdestructingmessage \n\
    /roll <n>d<x> \n\
    /randomperson [<status|role|allowbots>[|...]] \n\
    /secret \n\
    /revealsecret \n\
    /peekatsecret \n\
    /storeimage \n\
    /loadimage \n\
    /deleteimage \n\
    /listimagekeys \n\
    /booyeah \n\
    Feel free to experiment!';

    message.channel.send(response);
}

bot.login(auth.token);
