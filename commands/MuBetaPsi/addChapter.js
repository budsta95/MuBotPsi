exports.run = async (client, message, args, level) => {
  let categoryid;
  if(message.guild.id == '479997650784092170') categoryid = "";
  else return message.channel.send('Invalid Server');
  const old_category = message.guild.channels.cache.get(categoryid);
  if(!old_category) return message.channel.send('Invalid Category ID');
  if(old_category.type !== 'category') return message.channel.send('Invalid Category Type');
  
  let name = args.join(' ');
  if(!name) return message.channel.send('Invalid Name');
  
  //const old_officer = message.guild.roles.cache.find(i => i.name === 'Template Chapter Officer');
  const old_member = message.guild.roles.cache.find(i => i.name === 'Template Chapter');
  //if(!old_officer) return message.channel.send('Missing Template Chapter Officer role');
  if(!old_member) return message.channel.send('Missing Template Chapter Role');
  
  /*let new_officer = await message.guild.roles.create({ data: { 
    name: `${name} Officer`, 
    color: old_officer.color,
    hoist: old_officer.hoist,
    position: old_officer.position,
    permissions: old_officer.permissions,
    mentionable: old_officer.mentionable
  }});*/
  let new_member = await message.guild.roles.create({ data: { 
    name: `${name}`, 
    color: old_member.color,
    hoist: old_member.hoist,
    position: old_member.position,
    permissions: old_member.permissions,
    mentionable: old_member.mentionable
  }});
  //if(!new_officer) return message.channel.send('Error Template Officer role');
  if(!new_member) return message.channel.send('Error Creating Template Chapter Role');
  
  let category_perms = new client.Collection();
  old_category.permissionOverwrites.forEach(function(value, key) {
    if(key === old_officer.id) {
      let opt = {
          id: new_officer.id,
          type: value.type,
          deny: value.deny,
          allow: value.allow
      };
      category_perms.set(new_officer.id,opt);
    } else 
    if(key === old_member.id) {
      let opt = {
            id: new_member.id,
            type: value.type,
            deny: value.deny,
            allow: value.allow
      };
      category_perms.set(new_member.id,opt);
    }
    else category_perms.set(key,value);
  });
  let category_options = {
    type: old_category.type,
    position: old_category.rawPosition,
    permissionOverwrites: category_perms
  };
  let new_category = await message.guild.channels.create(`══╡${name}╞══ `,category_options);
  if(!new_category) return message.channel.send('❌ Error Occurred while Creating Category');
  else message.channel.send(`✅ Created ${new_category.name}`);
  
  old_category.children.forEach(async function(channel, key) {
    const permission = new client.Collection();
    channel.permissionOverwrites.forEach(function(value, key) {
      if(key === old_officer.id) {
        let opt = {
          id: new_officer.id,
          type: value.type,
          deny: value.deny,
          allow: value.allow
        };
        permission.set(new_officer.id,opt);
      } else 
      if(key === old_member.id) {
        let opt = {
            id: new_member.id,
            type: value.type,
            deny: value.deny,
            allow: value.allow
        };
        permission.set(new_member.id,opt);
      }
      else permission.set(key,value);
    });
    
    let option = {};
    if(channel.type = 'text') {
      option = {
        type: channel.type, 
        topic: channel.topic,
        parent: new_category.id,
        nsfw: channel.nsfw,
        position: channel.rawPosition,
        rateLimitPerUser: channel.rateLimitPerUser,
        permissionOverwrites: permission
      };
    } else 
    if(channel.type = 'voice') {
      option = {
        type: channel.type,
        parent: new_category.id,
        bitrate: channel.bitrate, 
        userLimit: channel.userLimit, 
        permissionOverwrites: permission
      };
    } 
    let new_name = channel.name.replace('template', name);
    let new_channel = await message.guild.channels.create(new_name, option); 
    if(!new_channel) return message.channel.send('❌ Error Occurred while Creating Channel ');
    else message.channel.send(`✅ Created ${new_channel.name}`);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Co-Admin", 
  cooldown: 5
};

exports.help = {
  name: "mbp addchapter",
  category: "MuBetaPsi",
  description: "To create channels and roles for new chapters ",
  usage: "mbp addchapter"
};
