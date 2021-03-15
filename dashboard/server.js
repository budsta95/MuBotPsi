const chalk = require("chalk");
const wakeUpDyno = require("./fetch.js");

module.exports = async client => {
  // Native Node Imports
  const path = require("path");
  
  // Express Session
  const express = require("express");
  const app = express();
  
  // The EJS templating engine gives us more power to create complex web pages. 
  // This lets us have a separate header, footer, and "blocks" we can use in our pages.
  app.engine("html", require("ejs").renderFile);
  app.set("view engine", "html");
  
  // body-parser reads incoming JSON or FORM data and simplifies their
  // use in code.
  var bodyParser = require("body-parser");
  app.use(bodyParser.json());       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  })); 
  /** REGULAR INFORMATION PAGES */
  app.get("/", (req, res) => {
    res.render(path.resolve(`${process.cwd()}${path.sep}dashboard${path.sep}index.ejs`), { 'bot': client });
  });
  
  app.listen(3000, function () {
    wakeUpDyno(`https://MuBotPsi.MuBotPsi.repl.co`);
    console.log(chalk.cyan(`>> Dashboard is online: port 3000`));
  });
};
