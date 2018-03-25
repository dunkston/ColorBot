Color Bot is a discord bot made in discord.js by dunkston

Originally, I made it due to someone's request for a simple bot that would only handle role management
They wanted a server with an abundance of color roles and a way to use a bot to get them
However, the server was meant to be simple, so there are not many features besides this

If you want to use this bot in your server, please add the following to config.json
token: the bot's token
guildId: the id of the server you want the bot to be in
ownerId: the id of the person hosting the bot (you)

Additionally, you can change a few settings in config.json
prefix: the prefix you want the bot commands to start with
rainbowFrequency: how many messages between each change of color with the rainbow commands

Command Information
colors: if no args are present, will DM the user with information on the server
If the user types "list" after the command, they will be sent a list of valid color names
If they supply a color's name, rgb, or hex code, they will be asked if they want it
creation: only usable by people with the manage roles permission in a channel named "creation"
Will create 216 color roles spread through the r, g, b values in multiples of 50
eval: only usable by the person hosting the bot, and allows them to execute js code in chat
invisible: lets a user become invisible in dark discord's chat or sidebar
prune: deletes the specified number of messages in a channel and can be filtered by user
rainbow: after activation, every X (default 10) messages, user's color will cycle through the rainbow
shutdown: only usable by the person hosting the bot, shuts down the bot
suggest: allows a user to suggest something to the server, and sends it to a channel named "suggestions"
mute: mute a user so they can't type in text channels
unmute: unmutes a user
reload: reloads the cache of a command so you don't need to restart the bot to apply changes

Additional Information
Will assign the role "New People" to new members, and delete it after a day
If you want to add support for more named colors, add them to colors.json
Welcomes a user in "general" channel on join and DMs them info
Run the bot by typing "node ." in the bot's directory or using run.bat
Server logs, including information such as message edits, will be sent to a channel named "logs"