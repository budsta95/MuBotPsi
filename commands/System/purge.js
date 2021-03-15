exports.run = async (client, message, args) => {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 99)
      return message.reply("Please provide a number between 2 and 100 (this means the most you can delete is 99) for the number of messages to delete");
    
    // Now delete the messages + 1 (for the command message itself!)
    message.channel.bulkDelete(deleteCount + 1,true)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["prune", "clear"],
  permLevel: "User", 
  cooldown: 2
};

exports.help = {
  name: "purge",
  category: "System",
  description: "Purges up to, but not including, 100 messages",
  usage: "purge [number between 2 and 100]"
};