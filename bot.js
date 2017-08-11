const   config = require('./config'); // Get the token from a config.json
const   Discord = require('discord.js'); // Import the discord.js module

const   client = new Discord.Client(); // Create an instance of a Discord client

var     isReady = true; //Bool to check if the bot is speaking


client.on('ready', () => {
    client.user.setGame(`Koh Lanta`);
    console.log(`Ready to serve on ${client.guilds.size} servers, for ${client.users.size} users.`);
});

let haTrigger = {               //Message who will trigger the bot
    "ah": "Denis te surveille",
    "ha": "C'est pas bien de dire ah",
    "a": "Mauvaise idee ici",
    "hah": "Bien essayer Loic",
    "<:ha:311864943047737344>": "'<:ha:311864943047737344>'"
};

function denis_brogniart(message)
{
    if (message.member.voiceChannel) 
        {
            var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            console.log("[" + time + "]" + " ah sent ! by " + message.author.username + " on Guild " + message.guild);

            isReady = false;
            message.member.voiceChannel.join().then(connection => { // Connection is an instance of VoiceConnection
            const dispatcher = connection.playFile('./AH.mp3');

            dispatcher.on('error', e => {
                console.log(e);
            });
            dispatcher.on('end', () => { //Disconnect the bot after playing the sound
               connection.disconnect();
               isReady = true;
            });

            }).catch(console.log);
        } 
         else 
            return ;
}

client.on('message', message => {

    if(message.author.bot) //Avoid self repeat
        return;

    if (haTrigger[message.content.toLowerCase()] && isReady)
        denis_brogniart(message);
});

client.login(config.botToken); // Log our bot in