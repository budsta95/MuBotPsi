// This event executes when a new guild (server) is left.

module.exports = (client, guild) => {
  if (!guild.available) return; // If there is an outage, return.
  client.logger.log(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`);
  client.user.setActivity(`${client.settings.status} | Serving ${client.guilds.cache.size} servers`);
  client.channels.cache.get('744477239600480306').send(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`,{ split: true });
};