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

client.on('ready', () => {
    client.user.setActivity(`you type ${prefix}colors`, {type: 'WATCHING'});
    client.user.setStatus('online');
    if(!client.guilds.get(guildId).roles.find('name', 'New People'))
        client.guilds.get(guildId).createRole({name: 'New People'});
    console.log('Ready!');
});

client.on('guildMemberAdd', async (member) => {
    const generalChannel = member.guild.channels.find('name', 'general');
    const newMemberRole = member.guild.roles.find('name', 'New People');
    await member.send({files: ['https://cdn.discordapp.com/attachments/424366599508852738/424370888805318681/abuelitaarmscrossed.png']});
    await member.send(`*Welcome to Simple, **${member.displayName}** 🐼!
One unique feature of our server is that we have **every color role available!** 🌈
Please type **.color r, g, b** to get a color using **RGB** values from 0-255
If you prefer hex codes instead, please type **.color 000000** or **.color #000000***
You can also use some color names. See the list of supported names by typing **${prefix}colors list*
Afterwards, react to the message that I send you with ✅ or ❌`);
    await member.send({file: 'https://cdn.discordapp.com/attachments/424366599508852738/424382683670380544/abuface.png'});
    await member.send(`Reply to me or type it in ${generalChannel} to get your color`);
    await member.send(`If you have any suggestions, feel free to type **${prefix}suggest [suggestion]`);
    await generalChannel.send(`Welcome ${member}`)
    .then(timedOut => {
        timedOut.delete(30000);
    });
    member.addRole(newMemberRole);
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
            if(!message.member.hasPermission(perm)) {
                return message.channel.send('You do not have the required permissions.')
                .then(timedOut => {
                    timedOut.delete(15000);
                });
            }
        }
    }
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