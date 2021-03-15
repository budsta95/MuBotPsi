// This event executes when a new guild (server) is joined.

module.exports = (client, guild) => {
  client.logger.log(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner.user.tag} (${guild.owner.user.id})`);
  client.user.setActivity(`${client.settings.status} | Serving ${client.guilds.cache.size} servers`);
  client.channels.cache.get('744477239600480306').send(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner.user.tag} (${guild.owner.user.id})`,{ split: true });
};
