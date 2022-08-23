const cheerio = require('cheerio');
const Discord = require("discord.js")
const rp = require('request-promise');
const config = require("./config.json");
const fs = require("fs");
const request = require("request");
const bot = new Discord.Client();
const reglas = (fs.readFileSync('comandos.txt', 'utf8'));

bot.commands = new Discord.Collection();

fs.readdir("./comandos/", (err, files) => {
    if (err) console.error(err);

    let arquivojs = files.filter(f => f.split(".").pop() == "js");
    arquivojs.forEach((f, i) => {
        let props = require(`./comandos/${f}`);
        console.log(`Comando ${f} cargado con exito.`)
        bot.commands.set(props.help.name, props);
    });
});


        bot.on("ready", () => {
            console.log(`Bot iniciando, con ${bot.users.size} usuários, en ${bot.channels.size} canales, en ${bot.guilds.size} servidores.`);
            bot.user.setPresence({

                game: {
                    name: 'Buscando alpiste.',
                    type: 0
                }
            });
        });

bot.on("message", async message => {

    if (message.channel.type === "dm") return;

    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let command = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);

    if (!command.startsWith(prefix)) return;

    let cmd = bot.commands.get(command.slice(prefix.length));
    if (cmd) cmd.run(bot, message, args);
    
    if (message.content.startsWith("!reglas")) { 
        message.channel.send(reglas);
    }
    if (message.content.startsWith("!comandos")) { 
        message.channel.send("!estado, !lista, !reglas, !comandos");
    }        

});

   bot.login(config.token); 