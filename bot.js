const   config = require('./config'); // Get the token from a config.json
const   Discord = require('discord.js'); // Import the discord.js module
const   fs = require('fs');
const   client = new Discord.Client(); // Create an instance of a Discord client

var     isReady = true; //Bool to check if the bot is speaking
var     song = require('./song.json'); //The song list in JSON

client.on('ready', () => {
    client.user.setGame(`Koh Lanta`);
    console.log(`Ready to serve on ${client.guilds.size} servers, for ${client.users.size} users.`);
});

function error_no_perm (err){
    isReady = true;
    console.log(err + "");
}

function play_song(message, song)
{
    if (message.member.voiceChannel) 
        {
            var file = song[message.content.toLowerCase()];

            isReady = false;
            if (!fs.existsSync(file))
                return;
            message.member.voiceChannel.join().then(connection => { // Connection is an instance of VoiceConnection
                var time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                console.log("[" + time + "]" + " " + file +  " sent by " + message.author.username + " on Guild " + message.guild);
                const dispatcher = connection.playFile(file);
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

    if(song.hasOwnProperty(message.content.toLowerCase()) && isReady)
        play_song(message, song);
    else
        return
});

client.login(config.botToken); // Log our bot in

