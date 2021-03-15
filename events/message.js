// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = async (client, message) => {
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot && message.author.id != "204255221017214977") return;

  // Grab the settings for this server from Enmap.
  // If there is no guild, get default conf (DMs)
  let settings = message.settings = client.settings;

  // Checks if the member has mute role, if yes return
  const muteRole = message.guild.roles.cache.get(message.settings.muteRole.slice(3, -1));
  if (muteRole && message.member.roles.cache.has(message.settings.muteRole.slice(3, -1))) return;

  // Checks if the bot was mentioned, with no message after it, returns the prefix.
  let prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention)) {
    return message.reply(`My prefix on this guild is \`${settings.prefix}\``);
  }

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file, but as a fall back we'll also use
  // a mention as a prefix.
  // So the prefixes array lists 2 items, the prefix from the settings and
  // the bots user id (a mention).
  let prefixes = [settings.prefix.toLowerCase(), `<@!${client.user.id}>`];
  let content = message.content.toLowerCase();
  let prefix = prefixes.find(p => content.startsWith(p));
  if (!prefix) return;
  
  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  let args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  let command = args.shift().toLowerCase();

  // If the member on a guild is invisible or not cached, fetch them.
  if (message.guild && !message.member) await message.guild.members.fetch(message.author);

  // Get the user or member's permission level from the elevation
  let level = client.permlevel(message);

  // Check whether the command, or alias, exist in the collections defined
  // in app.js.
  let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  // using this let varName = thing OR otherThing; is a pretty efficient
  // and clean way to grab one of 2 values!
  // Above code only 1 word is used as command, if we have a command with 2 words then below code helps
  if (!cmd) {
    let mod = command;
    if(args[0]) command += ` ${args.shift()}`;
    cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    // sometimes second word in command will not be letant.
    if(!cmd) command = `${mod} default`;
    cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  }
  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) return;
  // Some commands may not be useable in DMs. This check prevents those commands from running
  // and return a friendly error message.
  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (settings.systemNotice === "true") {
      return message.channel.send(`You do not have permission to use this command.
  Your permission level is ${level} (${client.permLevels.find(l => l.level === level).name})
  This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
    } else {
      return;
    }
  }

  // To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
  // The "level" command module argument will be deprecated in the future.
  message.author.permLevel = level;
  
  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }
  
    //Cooldowns 
  if (!client.cooldowns.has(command.name)) {
		client.cooldowns.set(command.name, new client.Collection());
	}
	let now = Date.now();
	let timestamps = client.cooldowns.get(command.name);
	let cooldownAmount = (cmd.conf.cooldown || 3) * 1000;
	if (timestamps.has(message.author.id)) {
		let expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			let timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // If the command exists, **AND** the user has permission, run it.
  client.logger.cmd(`[CMD] ${client.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
  message.channel.startTyping();
  message.channel.stopTyping();
  try {
    cmd.run(client, message, args, level);
  } 
  catch (e) {
    message.channel.send(`Error with the command, contact bot owner\n${e}`);
  }
};
