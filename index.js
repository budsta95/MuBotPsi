// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.
if (Number(process.version.slice(1).split(".")[0]) < 12) throw new Error("Node 12.0.0 or higher is required. Update Node on your system.");
// Importing this allows you to access the environment variables of the running node process
require('dotenv').config();
// Load up the discord.js library
const Discord = require("discord.js");
// Load internal fs-related node libraries
const fs = require("fs");
const { resolve } = require("path");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);
// Intents the bot needs.
// By default GuideBot needs Guilds, Guild Messages and Direct Messages to work.
// For join messages to work you need Guild Members, which is privileged and requires extra setup.
// For more info about intents see the README.
let intents = ["GUILDS","GUILD_MESSAGES","DIRECT_MESSAGES"];
// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`,
// or `bot.something`, this is what we're referring to. Your client.
const client = new Discord.Client({
  ws: {
    intents: intents
  }
});
// Here we load the config file that contains our settings values.
client.settings = require("./config.json");
// client.config.prefix contains the message prefix
// Create the Collections that hold the commands, as well as the command categories, and attach them to the client.
// Aliases and commands are put in collections where they can be read from,
// catalogued, listed, etc.
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.Collection = Discord.Collection;
client.MessageEmbed = Discord.MessageEmbed;
// SPLIT OPTIONS FOR MESSAGES MORE THAN 2000 CHARACTERS 
client.split = { 
    split : {
      maxLength: 1980,
      char: '\n', 
      prepend: "```", 
      append: "```"
    }
};
// the walk module is necessary to easily read files in subfolders (commands).
const walk = require("walk");
const walker = walk.walk("./commands");
// Require our logger
require("./library/Logger")(client);
// Let's start by getting some useful functions that we'll use throughout
// the bot, like logs and elevation features.
require("./library/functions.js")(client);
require("./library/permissions.js")(client);
// we load google sheets data
require("./library/sheets.js")(client);
// We're doing real fancy node 8 async/await stuff here, and to do that
// we need to wrap stuff in an anonymous function. It's annoying but it works.
const init = async () => {
  // Walker will load all the commands in all the subfolders, such as /commands/admin/reload.js , etc.
  walker.on("file", function (root, stats, next) {
    // Again, thanks Apple for .DS_STORE files. Lovely.
    if (!stats.name.endsWith(".js")) return;
    // Get the category name, as /commands/{category}/{commandname}.js
    let category = resolve(root).split("\\").slice(-1)[0];
    category = category.split('/commands/')[1];
    // Create the category if it doesn't exist.
    if (!client.categories.has(category)) {
      client.categories.set(category, []);
    }
    // Require the file in order to get its content.
    let props = require(`${resolve(root)}/${stats.name}`);
    // Remove the `.js` in the end.
    let commandName = stats.name.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    // Set the command in the commands collection
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
    // and add it to the category (this simplifies getting all the commands in a category!)
    client.categories.set(category, [
      ...client.categories.get(category),
      props.help.name,
    ]);
    // GOTO NEXT (that's a '90s joke for y'all)
    next();
  });
  walker.on("errors", function (root, nodeStatsArray, next) {
    console.log(nodeStatsArray);
    next();
  });
  // Open the events folder and read the files in it.
  // Each file must be named the same thing as a discord.js event!
  // Then we load events, which will include our message and ready event.
  const evtFiles = await readdir("./events/");
  console.log(`Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    console.log(`Loading Event: ${eventName}`);
    const event = require(`./events/${file}`);
    // Bind the client to any event, before the existing arguments
    // provided by the discord.js event. 
    // This line is awesome by the way. Just sayin'.
    client.on(eventName, event.bind(null, client));
  });
  // Generate a cache of client permissions for pretty perm names in commands.
  client.levelCache = {};
  for (let i = 0; i < client.permLevels.length; i++) {
    const thisLevel = client.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
 	}
  
  // SPLIT OPTIONS FOR MESSAGES MORE THAN 2000 CHARACTERS 
  client.split = { 
    split : {
      maxLength: 1980,
      char: '\n', 
      prepend: "```", 
      append: "```"
    }
  };

  // Log the client in, so it triggers the ready event and starts looking for messages.
  // The next line actually begins the bot's login. Usually you'd put the token here but in this case it's in the env file.
  await client.login(process.env.TOKEN);
  // End top-level async/await function.
}
init();

