exports.run = async (client, message, arg, level) => {
  const settings = message.settings;
  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  let command = args.shift().toLowerCase();
  
  if(!args[0]) {
    return message.channel.send('Invalid command, run ~help to get a list of valid commands that you can run.')
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User", 
  cooldown: 2
};

exports.help = {
  name: "mbp default",
  category: "MuBetaPsi",
  description: "Default Command for MuBetaPsi Module",
  usage: "mbp"
};