
var Bot = require('./bot.js');

var commandModules = [];

commandModules.push(require('./command-modules/sqlpoc.js'));
commandModules.push(require('./command-modules/store-image.js'));
commandModules.push(require('./command-modules/booyeah.js'));
commandModules.push(require('./command-modules/slap.js'));
commandModules.push(require('./command-modules/self-destroy.js'));
commandModules.push(require('./command-modules/dice.js'));
commandModules.push(require('./command-modules/lottery.js'));
commandModules.push(require('./command-modules/secret-messages.js'));
commandModules.push(require('./command-modules/save-attachments.js'));

var config = require('./config.json');

var bot = new Bot(commandModules, config);

bot.run();
