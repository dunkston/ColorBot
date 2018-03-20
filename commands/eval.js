const {ownerId} = require('../config.json');

const clean = text => {
    if (typeof(text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else return text;
}

module.exports = {
    name: 'eval',
    execute(message, args) {
        if(message.author.id != ownerId) return;
        try {
            const code = args.join(' ');
            let evaled = eval(code);
            if(typeof evaled !== 'string') evaled = require('util').inspect(evaled);
            const evalMessage = clean(evaled);
            if(evalMessage != 'Promise { <pending> }') message.channel.send(evalMessage, {code: 'x1'})
        }
        catch(error) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(error)}\n\`\`\``);
        }
    },
};