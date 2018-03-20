const client = require('../index.js');
const {prefix} = require('../config.json');
const Enmap = require('enmap');
client.colorTable = new Enmap();

module.exports = {
    name: 'creation',
    permissions: ['MANAGE_ROLES'],
    execute(message, args) {
        if(message.channel.name != 'creation') {
            return message.channel.send('Please use this command in a channel named \"creation\"')
            .then(async timedOut => {
                timedOut.delete(15000);
            });
        }
        const cCode = client.colorTable.get(message.guild.id) || {red: 0, green: 0, blue: 0};
        if(cCode.red == 0 && cCode.green == 0 && cCode.blue == 0) {
            message.guild.createRole({
                name: '0, 0, 0',
                color: [0, 0, 1],
            })
            cCode.blue += 50;
            client.colorTable.set(message.guild.id, cCode);
        }
        else if(cCode.blue < 250) {
            message.guild.createRole({
                name: `${cCode.red}, ${cCode.green}, ${cCode.blue}`,
                color: [cCode.red, cCode.green, cCode.blue],
            })
            cCode.blue += 50;
            client.colorTable.set(message.guild.id, cCode);
        }
        else if(cCode.green < 250){
            message.guild.createRole({
                name: `${cCode.red}, ${cCode.green}, ${cCode.blue}`,
                color: [cCode.red, cCode.green, cCode.blue],
            })
            cCode.blue = 0;
            cCode.green += 50;
            client.colorTable.set(message.guild.id, cCode);
        }
        else if(cCode.red <= 250) {
            message.guild.createRole({
                name: `${cCode.red}, ${cCode.green}, ${cCode.blue}`,
                color: [cCode.red, cCode.green, cCode.blue],
            })
            cCode.blue = 0;
            cCode.green = 0;
            cCode.red += 50;
        }
        client.colorTable.set(message.guild.id, cCode);

        if (cCode.red <= 250) {
            return message.channel.send(`${prefix}${this.name}`);
        }
    },
};