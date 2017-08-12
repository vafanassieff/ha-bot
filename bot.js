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

function error_no_perm (err){
    isReady = true
    console.log(err + "");
}

function denis_brogniart(message)
{
    if (message.member.voiceChannel) 
        {
            isReady = false;
            message.member.voiceChannel.join().then(connection => { // Connection is an instance of VoiceConnection
                var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                console.log("[" + time + "]" + " ah ! sent by " + message.author.username + " on Guild " + message.guild);
                const dispatcher = connection.playFile('./mp3/AH.mp3');

                dispatcher.on('error', e => {
                    console.log(e);
                });
                dispatcher.on('end', () => { //Disconnect the bot after playing the sound
                    connection.disconnect();
                    isReady = true;
                });

            }).catch(error_no_perm);
        } 
     else 
        return ;
}

function je_suis_pas_venu_ici(message)
{
    if (message.member.voiceChannel) 
        {
            isReady = false;
            message.member.voiceChannel.join().then(connection => { // Connection is an instance of VoiceConnection
                var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                console.log("[" + time + "]" + " Je suis pas venu ici pour souffir sent by " + message.author.username + " on Guild " + message.guild);
                const dispatcher = connection.playFile('./mp3/souffir.mp3');

                dispatcher.on('error', e => {
                    console.log(e);
                });
                dispatcher.on('end', () => { //Disconnect the bot after playing the sound
                    connection.disconnect();
                    isReady = true;
                });

            }).catch(error_no_perm);
        } 
     else 
        return ;
}

client.on('message', message => {
    if(message.author.bot) //Avoid self repeat
        return;

    if (haTrigger[message.content.toLowerCase()] && isReady)
        denis_brogniart(message);
    else if (message.content === "./souffir" && isReady)
        je_suis_pas_venu_ici(message);
});

client.login(config.botToken); // Log our bot in