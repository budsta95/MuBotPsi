module.exports = async (client, warning) => {
  client.logger.warn("warn", `A warning event was triggered by Discord.js: ${warning}`, "Client Warning");
};
