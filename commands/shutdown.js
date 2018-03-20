const {ownerId} = require('../config.json');
module.exports = {
    name: 'shutdown',
    execute(message, args) {
        if(message.author.id == ownerId) {
            message.delete();
            process.exit();
        }
    },
};