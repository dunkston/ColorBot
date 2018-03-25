const fs = require('fs');
const Discord = require('discord.js');
const {prefix, token, guildId, rainbowFrequency} = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands');
const cooldowns = new Discord.Collection();
const rainbowUsers = new Discord.Collection();
const rainbowCount = new Discord.Collection();

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const to12Hr = (time => {
    minutes = time.getMinutes().toString();
    if(parseInt(minutes) < 10) minutes = '0'.concat(minutes);
    hours = time.getHours();
    if(hours > 12) {
        hours -= 12;
        minutes = minutes.concat(' PM');
    }
    else if(hours == 0) {
        hours = 12;
        minutes = minutes.concat(' AM');
    }
    else if(hours == 12) minutes = minutes.concat(' PM');
    else minutes = minutes.concat(' AM');
    return hours.toString().concat(`:${minutes}`);
});

client.on('ready', () => {
    client.user.setActivity(`you type ${prefix}colors`, {type: 'WATCHING'});
    client.user.setStatus('online');
    let guild = client.guilds.get(guildId);
    if(!guild.roles.find('name', 'Muted')) guild.createRole({name: 'Muted'});
    if(!guild.roles.find('name', 'New People')) {
        guild.createRole({name: 'New People'});
        guild.channels.map(c => c.overwritePermissions(guild.roles.find('name', 'Muted'), {SEND_MESSAGES: false}));
    }
    if(!guild.channels.find('name', 'suggestions')) guild.createChannel('suggestions', 'text', [{
        id: guild.roles.find('name', 'Administrator'),
        allow: ['VIEW_CHANNEL']
    }, {
        id: guild.defaultRole,
        deny: ['VIEW_CHANNEL']
    }]);
    if(!guild.channels.find('name', 'logs')) guild.createChannel('logs', 'text', [{
        id: guild.roles.find('name', 'Administrator'),
        allow: ['VIEW_CHANNEL']
    }, {
        id: guild.defaultRole,
        deny: ['VIEW_CHANNEL']
    }]);
    console.log('Ready!');
});

client.on('guildMemberAdd', async (member) => {
    if(member.guild.id != guildId) return;
    const generalChannel = member.guild.channels.find('name', 'general');
    const newMemberRole = member.guild.roles.find('name', 'New People');
    await member.send({files: ['https://cdn.discordapp.com/attachments/424366599508852738/424370888805318681/abuelitaarmscrossed.png']});
    await member.send(`*Welcome to Simple, **${member.displayName}** 🐼!
One unique feature of our server is that we have **every color role available!** 🌈
Please type **.color r, g, b** to get a color using **RGB** values from 0-255
If you prefer hex codes instead, please type **.color 000000** or **.color #000000***
You can also use some color names. See the list of supported names by typing **${prefix}colors list**
Afterwards, react to the message that I send you with ✅ or ❌`);
    await member.send({file: 'https://cdn.discordapp.com/attachments/424366599508852738/424382683670380544/abuface.png'});
    await member.send(`Reply to me or type it in ${generalChannel} to get your color`);
    await member.send(`If you have any suggestions, feel free to type **${prefix}suggest [suggestion]**`);
    await generalChannel.send(`Welcome ${member}`)
    .then(timedOut => {
        timedOut.delete(30000);
    });
    member.addRole(newMemberRole);
    const joinEmbed = new Discord.RichEmbed()
            .setTitle('has joined the server')
            .setAuthor(`${member.user.tag}`, `${member.user.avatarURL}`)
            .setColor('0000ff')
            .setTimestamp()
    client.guilds.get(guildId).channels.find('name', 'logs').send(joinEmbed);
});

client.on('guildMemberRemove', member => {
    if(member.guild.id != guildId) return;
    const leaveEmbed = new Discord.RichEmbed()
            .setTitle('has left the server')
            .setAuthor(`${member.user.tag}`, `${member.user.avatarURL}`)
            .setColor('ff8000')
            .setTimestamp()
    client.guilds.get(guildId).channels.find('name', 'logs').send(leaveEmbed);
});

client.on('messageDelete', message => {
    if(message.attachments.size) content = message.attachments.map(a => a.url);
    else content = message.content;
    if(message.author.bot || message.content.startsWith(prefix) || message.channel.name == 'logs' || message.guild.id != guildId) return;
    const deletedEmbed = new Discord.RichEmbed()
            .setTitle(`Deleted a message in #${message.channel.name}`)
            .setAuthor(`${message.author.tag}`, `${message.author.avatarURL}`)
            .setColor('ff0000')
            .setTimestamp()
            .setFooter(`Originally sent: ${to12Hr(message.createdAt)}`)
            .setDescription(content)
    client.guilds.get(guildId).channels.find('name', 'logs').send(deletedEmbed);
});

client.on('messageUpdate', (oldMsg, newMsg) => {
    if(oldMsg.channel.name == 'logs' || oldMsg.guild.id != guildId) return;
    if(oldMsg.attachments.size) oldContent = oldMsg.attachments.map(a => a.url);
    else oldContent = oldMsg.content;
    if(newMsg.attachments.size) newContent = newMsg.attachments.map(a => a.url);
    else newContent = newMsg.content;
    const editedEmbed = new Discord.RichEmbed()
            .setTitle(`Edited a message in #${oldMsg.channel.name} from`)
            .setAuthor(`${oldMsg.author.tag}`, `${oldMsg.author.avatarURL}`)
            .setColor('00ff00')
            .setTimestamp()
            .setFooter(`Originally sent: ${to12Hr(oldMsg.createdAt)}`)
            .setDescription(oldContent)
            .addField('to', newContent)
    client.guilds.get(guildId).channels.find('name', 'logs').send(editedEmbed);
});

client.on('userUpdate', (oldUser, newUser) => {
    if(oldUser.avatar != newUser.avatar) {
    const avatarEmbed = new Discord.RichEmbed()
            .setTitle(`Changed their profile picture to`)
            .setAuthor(`${oldUser.tag}`, `${oldUser.avatarURL}`)
            .setColor('6480ff')
            .setTimestamp()
            .setThumbnail(`${newUser.avatarURL}`);
        return client.guilds.get(guildId).channels.find('name', 'logs').send(avatarEmbed);
    }
    else if(oldUser.username != newUser.username) {
        const usernameEmbed = new Discord.RichEmbed()
            .setTitle(`Changed their username to`)
            .setAuthor(`${oldUser.tag}`, `${oldUser.avatarURL}`)
            .setColor('8000ff')
            .setTimestamp()
            .setDescription(newUser.username)
        return client.guilds.get(guildId).channels.find('name', 'logs').send(usernameEmbed);
    }
});

client.on('message', message => {

    if(message.member) {
        if(message.member.roles.exists('name', 'New People') && (Date.now() - message.member.joinedTimestamp) / 86400000 >= 1)
            message.member.removeRole(message.guild.roles.find('name', 'New People'));
    }

    if(rainbowUsers.has(message.author.id)) {
        if (rainbowCount.get(message.author.id) == parseInt(rainbowFrequency) - 1) {
            rainbowUsers.set(message.author.id, client.commands.get('rainbow').execute(message, rainbowUsers.get(message.author.id) + 1));
            rainbowCount.set(message.author.id, 0);
        }
        else {
            rainbowCount.set(message.author.id, rainbowCount.get(message.author.id) + 1);
        }
    }
    
    if(message.content.startsWith(`${prefix}rainbow`) || message.content.startsWith(`${prefix}colorful`)) {
        if(rainbowUsers.has(message.author.id)){
            rainbowUsers.delete(message.author.id);
            rainbowCount.delete(message.author.id);
            return message.channel.send('Rainbow mode disabled')
            .then(async timedOut => {
                timedOut.delete(15000);
            });
        }
        else {
            rainbowUsers.set(message.author.id, 0);
            rainbowCount.set(message.author.id, 0);
            message.channel.send('Rainbow mode enabled')
            .then(async timedOut => {
                    timedOut.delete(15000);
            });
        }
    }

    if(!message.content.startsWith(prefix) || (message.author.bot && !message.content.startsWith(`${prefix}creation`))) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if(!command) return;
    if(command.permissions) {
        for(const perm of command.permissions) {
            if(!client.guilds.get(guildId).members.find('id', message.author.id).hasPermission(perm)) {
                return message.channel.send('You do not have the required permissions.')
                .then(timedOut => {
                    timedOut.delete(15000);
                });
            }
        }
    }

    if(commandName == 'reload' || commandName == 'refresh') return command.execute(message, args, client, commandFiles);

    if(command.args && !args.length) {
        let reply = 'Arguments are required for this command';
        if(command.usage) {
            reply += `\nPlease use: ${prefix}${command.name} ${command.usage}`;
        }
        return message.author.send(reply)
        .then(timedOut => {
            timedOut.delete(15000);
        });
    }
    if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 2) * 1000;

	if (!timestamps.has(message.author.id)) {
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}
    else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if(now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)} more seconds before using the ${commandName} command.`);
        }
    }
    
    try {
        command.execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('An error has occurred.');
    }
});

client.login(token);