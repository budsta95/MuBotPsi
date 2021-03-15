/* Logger class for easy and aesthetically pleasing console logging */
const chalk = require("chalk");
const moment = require("moment");
const default_channel = '787143762857558047';

module.exports = (client) => {
  client.logger = {};
  client.logger['log']     = (...args) => log(...args, "log");
  client.logger['error']   = (...args) => log(...args, "error");
  client.logger['warn']    = (...args) => log(...args, "warn");
  client.logger['debug']   = (...args) => log(...args, "debug");
  client.logger['cmd']     = (...args) => log(...args, "cmd");
  client.logger['discord'] = (...args) => discord(...args, "cmd");
  client.logger['ready'] = (...args) => discord(...args, "ready");
  function log (content, type = "log") {
    const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
    discord(content, type);
    switch (type) {
      case "log": {
        return console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content} `);
      }
      case "warn": {
        return console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content} `);
      }
      case "error": {
        return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `);
      }
      case "debug": {
        return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content} `);
      }
      case "cmd": {
        return console.log(`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content}`);
      }
      case "ready": {
        return console.log(`${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${content}`);
      }
      default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
    }
  }
  function discord(content, type) {
    let channel;
    switch (type) {
      case "log": {
        channel = client.channels.cache.get(default_channel);
        break;
      }
      case "warn": {
        channel = client.channels.cache.get(default_channel);
        break;
      }
      case "error": {
        channel = client.channels.cache.get(default_channel);
        break;
      }
      case "debug": {
        channel = client.channels.cache.get(default_channel);
        break;
      }
      case "cmd": {
        channel = client.channels.cache.get(default_channel);
        break;
      }
      case "ready": {
        channel = client.channels.cache.get(default_channel);
        break;
      }
    };
    if(!channel) return;
    channel.send(content,{ split: true });
  }
};