const {prefix, guildId} = require('../config.json');
module.exports = {
    name: 'suggest',
    aliases: ['suggestion', 'suggestions'],
    args: true,
    execute(message, args) {
        if(message.channel.type == 'text') message.delete();
        const suggestion = message.content.slice(prefix.length).split(/ +/).slice(1).join(' ');
        return message.client.guilds.get(guildId).channels.find('name', 'suggestions').send(`**${message.member.displayName} says:** ${suggestion}`);
    },
};