const {prefix, guildId} = require('../config.json');
const {namedColors} = require('../colors.json');
const Discord = require('discord.js');
const embedReactionFilter = (reaction, user) => {
    return user.id != '422908283800518686' && ['✅','❌'].includes(reaction.emoji.name);
};

process.on('unhandledRejection', error => console.error(`Uncaught Promise Rejection:\n${error}`));
module.exports = {
    name: 'colors',
    aliases: ['color', 'roles', 'colours', 'colour', 'role', 'info', 'add', 'colorinfo', 'colourinfo'],
    async execute(message, args) {
        if(message.channel.type == 'text') message.delete();
        var isHex = false;
        if(args.length && (args[0].length == 6 || (args[0].length == 7 && args[0].startsWith('#'))) && !message.content.includes(',')) isHex = true;
        if(!args.length) {
            if(message.channel.type !== 'dm') {
                await message.reply('Please check your DMs for more information')
                .then(async timedOut => {
                    timedOut.delete(15000);
                });
            }
            const generalChannel = message.guild.channels.find('name', 'general');
            await message.author.send({files: ['https://cdn.discordapp.com/attachments/424366599508852738/424370888805318681/abuelitaarmscrossed.png']});
            await message.author.send(`*Welcome to Simple, **${message.member.displayName}** 🐼!
One unique feature of our server is that we have **every color role available!** 🌈
Please type **.color r, g, b** to get a color using **RGB** values from 0-255
If you prefer hex codes instead, please type **.color 000000** or **.color #000000***
You can also use some color names. See the list of supported names by typing **${prefix}colors list**
Afterwards, react to the message that I send you with ✅ or ❌`);
            await message.author.send({file: 'https://cdn.discordapp.com/attachments/424366599508852738/424382683670380544/abuface.png'});
            return await message.author.send(`Reply to me or type it in ${generalChannel} to get your color`);
        }
        else if(args[0] == 'list' || args[0] == 'names' || args[0] == 'name') {
            const colorNames = namedColors.map(c => c.name);
            message.author.send(`__**Supported color names:**__\n${colorNames.join(', ')}`);
            return message.author.send(`Type **.colors [color name]** to get the color\nDon't forget to react with a ✅`);
        }
        else {
            const targetGuild = message.client.guilds.get(guildId);
            const targetMember = targetGuild.members.get(message.author.id);
            var nameStr = args.length == 2 ? args[0].concat(` ${args[1]}`) : args[0];
            const colorNames = namedColors.map(c => c.name);
            var wasNamed = false;
            if(colorNames.includes(nameStr)) {
                const namedCode = namedColors[colorNames.indexOf(nameStr)].code.split(' ');
                firstArg = namedCode[0];
                secondArg = namedCode[1];
                thirdArg = namedCode[2];
                wasNamed = true;
                isHex = false;
            }
            if(!isHex) {
                if(args.length >= 3 || wasNamed) {
                    if(!wasNamed) {
                        firstArg = args[0];
                        secondArg = args[1];
                        thirdArg = args[2];
                    }
                    firstArg.endsWith(',') ? r = parseInt(firstArg.slice(0, -1)) : r = parseInt(firstArg);
                    secondArg.endsWith(',') ? g = parseInt(secondArg.slice(0, -1)) : g = parseInt(secondArg);
                    var b = parseInt(thirdArg);
                }
                else {
                    args[0].endsWith(',') ? totalArgs = args[0] : totalArgs = args[0].concat(',');
                    if(args.length == 2) totalArgs = totalArgs.concat(args[1]);
                    var splitArgs = totalArgs.split(',');
                    var r = parseInt(splitArgs[0]);
                    var g = parseInt(splitArgs[1]);
                    var b = parseInt(splitArgs[2]);
                }
                if(r <= 0) r = 0;
                if(g <= 0) g = 0;
                if(b <= 0) b = 0;
                if(r > 255) r = 255;
                if(g > 255) g = 255;
                if(b > 255) b = 255;
                var red = r.toString(16);
                var green = g.toString(16);
                var blue = b.toString(16);
                if(r < 16) red = '0'.concat(red);
                if(g < 16) green = '0'.concat(green);
                if(b < 16) blue = '0'.concat(blue);
                var totalColor = ''.concat(red).concat(green).concat(blue);
            }
            else {
                var totalColor = args[0].slice(-6);
                var r = parseInt(args[0].slice(-6, -4),16);
                var g = parseInt(args[0].slice(-4, -2),16);
                var b = parseInt(args[0].slice(-2),16);
            }

            if(isNaN(r) || isNaN(g) || isNaN(b))
                return message.channel.send('Please enter a valid number')
                .then(async timedOut => {
                    timedOut.delete(15000);
                });

            const colorEmbed = new Discord.RichEmbed()
            .setTitle('**Color Information**')
            .setAuthor('Color Bot', 'https://cdn.discordapp.com/avatars/422908283800518686/2def9a32461272a4e7005f0f1620622e.png')
            .setColor(`${totalColor}`)
            .setThumbnail(`https://www.colorcombos.com/images/colors/${totalColor}.png`)
            .setDescription('React with \\✅ to get this color\nIf you do not want it, react with \\❌')
            .setTimestamp()
            .setFooter('You have two minutes to respond')
            .addField('Color Code (r, g, b)', `${r}, ${g}, ${b}`)
            .addField('Color Code (hex)', `${totalColor}`)

            return message.author.send(colorEmbed)
            .then(async sentMessage => {
                await sentMessage.react('✅');
                await sentMessage.react('❌');
                sentMessage.awaitReactions(embedReactionFilter, {max: 1, time: 120000, errors: ['time']})
                    .then(collected => {
                        const reaction = collected.first();
                        if(reaction.emoji.name == '✅') {
                            sentMessage.delete();
                            const colorRounder = colorArg => {return 50 * Math.round(colorArg / 50);};
                            const colorName = `${colorRounder(r)}, ${colorRounder(g)}, ${colorRounder(b)}`;
                            const colorId = targetGuild.roles.find('name', colorName);
                            if(targetMember.colorRole) targetMember.removeRole(targetMember.colorRole);
                            targetMember.addRole(colorId)
                            .catch(console.error);
                            return message.author.send('Successfully changed your color')
                            .then(async timedOut => {
                                timedOut.delete(15000);
                            });
                        }
                        else {
                            return sentMessage.delete();
                        }
                    })
                    .catch(collected => {
                        sentMessage.delete();
                        return message.author.send('Time limit exceeded')
                        .then(async timedOut => {
                            timedOut.delete(15000);
                        });
                    });
            });
        }
    },
};