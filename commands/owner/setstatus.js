exports.run = async (client, message, args, level) => {
  client.settings['status'] = args.join(' ');
  client.user.setActivity(`${client.settings.status} | Serving ${client.guilds.cache.size} servers`);
  message.reply(`Bot status set to: ${args.join(' ')}`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Bot Admin", 
  cooldown: 2
};

exports.help = {
  name: "setstatus",
  description: "Set bot\'s status.",
  usage: "setstatus text"
};