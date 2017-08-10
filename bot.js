// Import the discord.js module

const config = require('./config'); // Get the token from a config.json
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

client.on('ready', () => {
    client.user.setGame(`on ${client.guilds.size} servers`);
    console.log(`Ready to serve on ${client.guilds.size} servers, for ${client.users.size} users.`);
});

let responseObject = { //Message who will trigger the bot
    "ah": "Denis te surveille",
    "ha": "C'est pas bien de dire ah",
    "a": "Mauvaise idee ici",
    "hah": "Bien essayer Loic",
    "<:ha:311864943047737344>": "Grosse emote"
};

client.on('message', message => {

    if(message.author.bot) //Avoid repeat
        return;

    if (responseObject[message.content.toLocaleLowerCase()])
    {
        var ret = "<:ha:311864943047737344> ";
        ret += message.author;
        message.author.send(ret);

        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then(connection => { // Connection is an instance of VoiceConnection
            
            const dispatcher = connection.playFile('./AH.mp3');

            dispatcher.on('end', () => { //Disconnect the bot after playing the sound
               connection.disconnect();
            });

            }).catch(console.log);
        } 
         else 
            return ;
    }
});

// Log our bot in
client.login(config.botToken);