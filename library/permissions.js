module.exports = (client)  => {
    // Bot Owner, level 10 by default. A User ID. Should never be anything else than the bot owner's ID.
  client.ownerID = '97563473105387520';
  // Bot Admins, level 9 by default. Array of user ID strings.
  client.admins = ['97563473105387520'];
  // Bot Support, level 8 by default. Array of user ID strings
  client.support = ['97563473105387520'];
  // Bot Staff, level 7 by default. Array of user ID strings
  client.staff = [97563473105387520];
  client.permLevels = [
    // This is the lowest permisison level, this is for non-roled users.
    { level: 0,
      name: "User", 
      // Don't bother checking, just return true which allows them to execute any command their
      // level allows them to.
      check: () => true
    },
    { level: 1,
      name: "Staff", 
      check: (message) => {
        try {
          let perms = message.member.permissions;
          if(perms.has("MANAGE_MESSAGES")) return true;
        }
        catch (e) {
          return false;
        }
      }
    },
    { level: 2,
      name: "Mod", 
      check: (message) => {
        try {
          let perms = message.member.permissions;
          if(perms.has("MANAGE_CHANNELS") || perms.has("MANAGE_ROLES_OR_PERMISSIONS")) return true;
        }
        catch (e) {
          return false;
        }
      }
    },
    // This is your permission level, the staff levels should always be above the rest of the roles.
    { level: 3,
      // This is the name of the role.
      name: "Moderator",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          let perms = message.member.permissions;
          if(perms.has("KICK_MEMBERS")) return true;
          const modRole = message.guild.roles.cache.get(message.settings.modRole.slice(3, -1));
          if (modRole && message.member.roles.cache.has(message.settings.modRole.slice(3, -1))) return true;
        }
        catch (e) {
          return false;
        }
      }
    },
    { level: 4,
      name: "Co-Admin", 
      check: (message) => {
        try {
          let perms = message.member.permissions;
          if(perms.has("MANAGE_GUILD") || perms.has("BAN_MEMBERS")) return true;
        }
        catch (e) {
          return false;
        }
      }
    },
    { level: 5,
      name: "Administrator", 
      check: (message) => {
        let perms = message.member.permissions;
        if(perms.has("ADMINISTRATOR")) return true;
        try {
          const adminRole = message.guild.roles.cache.get(message.settings.adminRole.slice(3, -1));
          if (adminRole && message.member.roles.cache.has(message.settings.adminRole.slice(3, -1))) return true;
        }
        catch (e) {
          return false;
        }
      }
    },
    // This is the server owner.
    { level: 6,
      name: "Server Owner", 
      // Simple check, if the guild owner id matches the message author's ID, then it will return true.
      // Otherwise it will return false.
      check: (message) => message.channel.type === "text" ? (message.guild.ownerID === message.author.id ? true : false) : false
    },
    // Bot Support is a special inbetween level that has the equivalent of server owner access
    // to any server they joins, in order to help troubleshoot the bot on behalf of owners.
    { level: 7,
      name: "Bot Staff",
      check: (message) => client.staff.includes(message.author.id)
    },
    { level: 8,
      name: "Bot Support",
      // The check is by reading if an ID is part of this array. Yes, this means you need to
      // change this and reboot the bot to add a support user. Make it better yourself!
      check: (message) => client.support.includes(message.author.id)
    },
    // Bot Admin has some limited access like rebooting the bot or reloading commands.
    { level: 9,
      name: "Bot Admin",
      check: (message) => client.admins.includes(message.author.id)
    },
    // This is the bot owner, this should be the highest permission level available.
    // The reason this should be the highest level is because of dangerous commands such as eval
    // or exec (if the owner has that).
    { level: 10,
      name: "Bot Owner", 
      // Another simple check, compares the message author id to the one stored in the config file.
      check: (message) => message.client.ownerID === message.author.id
    }
  ];
  /*
  PERMISSION LEVEL FUNCTION

  This is a very basic permission system for commands which uses "levels"
  "spaces" are intentionally left black so you can add them if you want.
  NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
  command including the VERY DANGEROUS `eval` and `exec` commands!

  */
  client.permlevel = message => {
    let permlvl = 0;
    const permOrder = client.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);
    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  };
};