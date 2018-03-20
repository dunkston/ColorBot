const {prefix, guildId} = require('../config.json');
module.exports = {
    name: 'rainbow',
    aliases: ['colorful'],
    execute(message, colorIndex) {
        const targetGuild = message.client.guilds.get(guildId);
        const targetMember = targetGuild.members.get(message.author.id);
        if(message.content.startsWith(`${prefix}rainbow`) && message.channel.type == 'text') message.delete();
        if(!colorIndex) colorIndex = 0;
        switch(parseInt(colorIndex)) {
            case 1:
                colorId = targetGuild.roles.find('name', '250, 150, 0');
                if(targetMember.colorRole) targetMember.removeRole(targetMember.colorRole);
                targetMember.addRole(colorId);
                return 2;
                break;
            case 2:
                colorId = targetGuild.roles.find('name', '250, 250, 0');
                if(targetMember.colorRole) targetMember.removeRole(targetMember.colorRole);
                targetMember.addRole(colorId);
                return 3;
                break;
            case 3:
                colorId = targetGuild.roles.find('name', '0, 250, 0');
                if(targetMember.colorRole) targetMember.removeRole(targetMember.colorRole);
                targetMember.addRole(colorId);
                return 4;
                break;
            case 4:
                colorId = targetGuild.roles.find('name', '0, 0, 250');
                if(targetMember.colorRole) targetMember.removeRole(targetMember.colorRole);
                targetMember.addRole(colorId);
                return 5;
                break;
            case 5:
                colorId = targetGuild.roles.find('name', '150, 0, 250');
                if(targetMember.colorRole) targetMember.removeRole(targetMember.colorRole);
                targetMember.addRole(colorId);
                return 6;
                break;
            default:
                colorId = targetGuild.roles.find('name', '250, 0, 0');
                if(targetMember.colorRole) targetMember.removeRole(targetMember.colorRole);
                targetMember.addRole(colorId);
                return 1;
        }
    },
};