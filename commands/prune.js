module.exports = {
    name: 'prune',
    aliases: ['purge', 'delete', 'remove', 'clear', 'clean'],
    args: true,
    permissions: ['MANAGE_MESSAGES'],
    execute(message, args) {
        var num = parseInt(args[0]) + 1;
        if (isNaN(num)) num = parseInt(args[1]) + 1;
        if (isNaN(num)) return message.channel.send('Please enter a valid number')
        .then(async timedOut => {
            timedOut.delete(15000);
        });
        if(message.mentions.users.size && message.mentions.users.first().id != message.author.id) {
            message.delete();
            num--;
            if(num < 0) num = 0;
        }
        else if(num <= 0) num = 1;
        if(num > 100) num = 100;

        message.channel.fetchMessages({
            limit: 100
        })
        .then(messages => {
            if(message.mentions.users.size) {
                const targetUser = message.mentions.users.first();
                messages = messages.filter(m => m.author.id == targetUser.id).array().slice(0, num);
            }
            else {
                messages = messages.array().slice(0, num);
            }
            return message.channel.bulkDelete(messages, true)
        })
        .catch(console.error);
    },
};