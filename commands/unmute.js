const {guildId} = require('../config.json');
module.exports = {
    name: 'unmute',
    args: true,
    permissions: ['MANAGE_ROLES'],
    execute(message, args) {
        if(message.channel.type == 'text') message.delete();
        const tagCount = message.mentions.users.array().length;
        const targetGuild = message.client.guilds.get(guildId);
        const muteRole = targetGuild.roles.find('name', 'Muted');
        if(tagCount) {
            targetMember = targetGuild.members.find('id', message.mentions.users.first().id);
        }
        else {
            const input = message.content.slice(message.content.indexOf(' ') + 1);
            if(input.charAt(input.length - 5) == '#') {
                let targetId = targetGuild.members.filter(m => m.user.tag == input).map(u => u.id);
                targetMember = targetGuild.members.find('id', targetId[0]);
            }
            else {
                let targetUsername = targetGuild.members.filter(m => m.user.username == input).map(u => u.id);
                if(targetUsername) targetMember = targetGuild.members.find('id', targetUsername[0]);
                else {
                    targetMember = targetGuild.members.find('displayName', input);
                    if(!targetMember) return message.channel.send('Invalid user')
                    .then(timedOut => {
                        timedOut.delete(15000);
                    });
                }
            }
        }
        targetMember.removeRole(muteRole);
        return message.channel.send(`${targetMember.displayName} has been unmuted`)
        .then(timedOut => {
            timedOut.delete(15000);
        });
    }
};