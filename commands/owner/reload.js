exports.run = (client, message, args) => {
  if (!args || args.size < 2) {
    return message.reply("Must provide a category and command name to reload.");
  }
  let category = args[0];
  let commandName = args[1];
  if (!client.categories.has(category)) {
    return message.reply("That category does not exist");
  }
  // Check if the command exists and is valid
  if (!client.commands.has(commandName)) {
    return message.reply("That command does not exist");
  }
  // Remove the cached version of this command, otherwise this would do nothing.
  // the path is relative to the *current folder*, so just ./filename.js
  Reflect.deleteProperty(require.cache, require.resolve(`../${category}/${commandName}.js`));
  // We also need to delete and reload the command from the client.commands Collection.
  client.commands.delete(commandName);
  // Now we reload the command.
  let props = require(`../${category}/${commandName}.js`);
  client.commands.set(commandName, props);
  message.reply(`The command ${commandName} has been reloaded`);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Bot Admin", 
  cooldown: 2
};

exports.help = {
  name: "reload",
  category: "Owner",
  description: "",
  usage: "reload <category> <command>"
};