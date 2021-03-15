/*
The HELP command is used to display every command's name and description
to the user, so that he may see what commands are available. The help
command is also filtered by level, so if a user does not have access to
a command, it is not shown to them. If a command name is given with the
help command, its extended help is shown.
*/

exports.run = async (client, message, args, level) => {
  // If no specific command is called, show all filtered commands.
  const MessageEmbed = client.MessageEmbed;
  if (!args[0]) {
    const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('= Command List =')
            .setDescription(`All commands available at https://MuBotPsi.MuBotPsi.repl.co/`)
            .setFooter(`[Use ${message.settings.prefix}help <commandname> for details]`);
    await client.categories.map((commands, category) => {
      let myCommands = client.commands.filter(cmd => commands.includes(cmd.help.name));
      // Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
      myCommands = message.guild ? myCommands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level) : myCommands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);
      // Here we have to get the command names only, and we use that array to get the longest name.
      // This make the help commands "aligned" in the output.
      const longest = commands.reduce((long, str) => Math.max(long, str.length), 0);
      const sorted = myCommands.array().sort((p, c) => p.help.name > c.help.name ? 1 : -1 );
      let output = '';
      sorted.forEach(c => output += `${message.settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`);
      embed.addField(category,`\`\`\`${output}\`\`\``);
    });
    message.channel.send(embed);
  } 
  else {
    // Show individual command's help.
    let command = client.commands.get(args[0]) || client.commands.get(`${args[0]} ${args[1]}`);
    if (command) {
      if (level < client.levelCache[command.conf.permLevel]) return;
      const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(command.help.name.toProperCase())
            .setFooter(`Requested by ${message.author.tag}`)
            .setDescription(command.help.description)
            .addField('Usage',command.help.usage);
      if(command.conf.aliases.length > 0) embed.addField('Aliases', command.conf.aliases.join(", "));
      message.channel.send(embed);
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["h", "halp"],
  permLevel: "User", 
  cooldown: 2
};

exports.help = {
  name: "help",
  category: "System",
  description: "Displays all the available commands for your permission level.",
  usage: "help [command]"
};
