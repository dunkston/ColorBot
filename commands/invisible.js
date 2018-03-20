const {guildId} = require('../config.json');
module.exports = {
    name: 'invisible',
    args: true,
    aliases: ['invis'],
    execute(message, args) {
        const targetGuild = message.client.guilds.get(guildId);
        if(!targetGuild.roles.find('name', 'Invisible (Chat)'))
            targetGuild.createRole({name: 'Invisible', color: [54, 57, 62]});
        if(!targetGuild.roles.find('name', 'Invisible (Sidebar)'))
            targetGuild.createRole({name: 'Invisible', color: [47, 49, 54]});
        if(message.channel.type == 'text') message.delete();
        if(args[0] != 'sidebar' && args[0] != 'chat') return;      
        const targetMember = targetGuild.members.get(message.author.id);
        args[0] == 'sidebar' ? invisType = 'Sidebar' : invisType = 'Chat';
        const invisRole = targetGuild.roles.find('name', `Invisible (${invisType})`);
        if(targetMember.colorRole) targetMember.removeRole(targetMember.colorRole);
        targetMember.addRole(invisRole)
        .catch(console.error);
        return message.author.send('Successfully changed your color')
        .then(async timedOut => {
            timedOut.delete(15000);
        });
    },
}