# Mu Bot Psi
An example of a Discord.js Bot Handler. Updated and Maintained by the Idiot's Guide Community.

## Requirements
- `git` command line ([Windows](https://git-scm.com/download/win)|[Linux](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)|[MacOS](https://git-scm.com/download/mac)) installed
- `node` [Version 12.0.0 or higher](https://nodejs.org)
- The node-gyp build tools. This is a pre-requisite for Enmap, but also for a **lot** of other modules. See [The Enmap Guide](https://enmap.evie.codes/install#pre-requisites) for details and requirements for your OS. Just follow what's in the tabbed block only, then come back here!

You also need your bot's token. This is obtained by creating an application in
the [Developer section](https://discord.com/developers) of discord.com. Check the [first section of this page](https://anidiots.guide/getting-started/the-long-version.html) 
for more info.

Steps
- Pull Request from this repository and clone it to your desktop
- Open Command Prompt in the above cloned folder
- If you want to test 1st before you submit to main bot! Use your own token in `.env`;

## Intents

Guidebot uses intents which are required as of October 7, 2020. 
You can enable privileged intents in your bot page 
(the one you got your token from) under `Privileged Gateway Intents`.

By default GuideBot needs the Guilds, Guild Messages and Direct Messages intents to work.
For join messages to work you need Guild Members, which is privileged.
User counts that GuideBot has in places such as in the ready log, and the stats 
command may be incorrect without the Guild Members intent.

Intents are loaded from your config, and will get created by the setup scripts.

For more info about intents checkout the [official Discord.js guide page](https://discordjs.guide/popular-topics/intents.html) and the [official Discord docs page](https://discord.com/developers/docs/topics/gateway#gateway-intents).

## Setup - hosting on your device
Open the .env file and write your token in the appropriate location after the =
Do the same for your User ID and the bot's desired prefix.

Note that env files are not json or js files, do not put quotes or space anywhere.
The equal sign defines the variable's value, so `PREFIX=+` , is like `const PREFIX = "+";`

It should look like: 

```
DISCORD_TOKEN=MTg-this-IzNzU3OTA5NjA-is.not-DCeFB-a.real-r4DQlO-t0ken-qerT0
OWNER=139412744439988224
PREFIX=+
```
Save the file, and start your app, and it should login.

## Starting the bot
To start the bot, in the command prompt, run the following command:
`node index.js`

## Inviting to a guild

To add the bot to your guild, you have to get an oauth link for it. 

You can use this site to help you generate a full OAuth Link, which includes a calculator for the permissions:
[https://finitereality.github.io/permissions-calculator/?v=0](https://finitereality.github.io/permissions-calculator/?v=0)

## Hosting on Heroku
- Open [Heroku dashboard](https://dashboard.heroku.com/apps/)
- Choose your app and goto app settings page
- Under `config vars` choose `Reveal Config Vars`
- Enter the following values
- KEY: `TOKEN` and Value: `your bot tokenId`
