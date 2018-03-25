module.exports = {
    name: 'reload',
    aliases: ['refresh'],
    permissions: ['ADMINISTRATOR'],
    async execute(message, args, client, commandFiles) {
        if(args.length) {
            const commandName = args[0].toLowerCase();
            const command = client.commands.get(commandName)
            || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            if(!command) return;
            await delete require.cache[require.resolve(`./${commandName}.js`)];
            await client.commands.set(commandName, require(`./${commandName}.js`));
            message.channel.send(`${commandName} was successfully reloaded`)
            .then(timedOut => {
                timedOut.delete(15000);
            });
        }
        else {
            for(const file of commandFiles) {
                await delete require.cache[require.resolve(`./${file}`)];
                await client.commands.set(file.slice(0, -3), require(`./${file}`));
            }
            message.channel.send('All commands have successfully been reloaded')
            .then(timedOut => {
                timedOut.delete(15000);
            });
        }
    }
}