module.exports = (client) => {
  /* EMBED FUNCTION */
  client.embed = (message, description, title, footer) => {
    if(!description) return;
    let embed = new client.MessageEmbed()
          .setColor(0x00DBFF)
          .setDescription(description);
    if(title) embed.setTitle(title);
    if(!footer || footer == 'default') embed.setFooter(`Requested by: ${message.author.tag}`);
    else embed.setFooter(footer);
    try {
      message.delete();
    } catch (e) {
      client.error('Unable to Delete Message');
    }
    message.channel.send(embed);
  };
  /*GET ROLE*/
  client.getRole = (mention, message) => {
    if (!mention) return false;
    if(mention.startsWith('-')) mention = mention.slice(1);
    if (mention.startsWith('<@&') && mention.endsWith('>')) {
		  mention = mention.slice(3, -1);
		  if (mention.startsWith('!')) mention = mention.slice(1);
		  return message.guild.roles.cache.get(mention);
    } else
    if (isNaN(mention)) return message.guild.roles.cache.find(role => role.name === mention);
    else return message.guild.roles.cache.get(mention);
  };
  /*GET CHANNEL*/
  client.getChannel = (mention, message) => {
    if (!mention) return false;
    if(mention.startsWith('-')) mention = mention.slice(1);
    if (mention.startsWith('<#') && mention.endsWith('>')) {
      mention = mention.slice(2, -1);
		  return message.guild.channels.cache.get(mention);
    } else
    if (isNaN(mention)) return message.guild.channels.cache.find(channel => channel.name === mention);
    else return client.channels.cache.get(mention);
  };
  /*
  SINGLE-LINE AWAITMESSAGE

  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...

  USAGE

  const response = await client.awaitReply(msg, "Favourite Color?");
  msg.reply(`Oh, I really love ${response} too!`);

  */
  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };


  /*
  MESSAGE CLEAN FUNCTION

  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped so they're shown more easily. As a bonus it resolves promises
  and stringifies objects!
  This is mostly only used by the Eval and Exec commands.
  */
  client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof text !== "string")
      text = require("util").inspect(text, {depth: 1});

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
  };
  /* MISCELANEOUS NON-CRITICAL FUNCTIONS */
  
  // EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
  // later, this conflicts with native code. Also, if some other lib you use does
  // this, a conflict also occurs. KNOWING THIS however, the following 2 methods
  // are, we feel, very useful in code. 
  
  // <String>.toPropercase() returns a proper-cased string such as: 
  // "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
  Object.defineProperty(String.prototype, "toProperCase", {
    value: function() {
      return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
  });

  // <Array>.random() returns a single random element from an array
  // [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
  Object.defineProperty(Array.prototype, "random", {
    value: function() {
      return this[Math.floor(Math.random() * this.length)];
    }
  });

  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require("util").promisify(setTimeout);

  // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    client.logger.error(`Uncaught Exception: ${errorMsg}`);
    console.error(err);
    // Always best practice to let the code crash on uncaught exceptions. 
    // Because you should be catching them anyway.
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    client.logger.error(`Unhandled rejection: ${err}`);
    console.error(err);
  });
};
