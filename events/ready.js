const chalk = require("chalk");
const Discord = require("discord.js");
module.exports = async client => {
  // This event will run if the bot starts, and logs in, successfully.
  // Log that we're ready to serve, so we know the bot accepts commands.
  console.log(chalk.greenBright(`\n>> Bot is ready!`));
  console.log('>> Logged in as ' + client.user.username);
  console.log('>> Total Users: ' + client.users.cache.size);
  console.log('>> Total Servers: ' + client.guilds.cache.size);
  client.logger.ready('>> Logged in as ' + client.user.username);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`${client.settings.status} | Serving ${client.guilds.cache.size} servers`);
  // Load the bot home page
  require('../dashboard/server.js')(client);
};