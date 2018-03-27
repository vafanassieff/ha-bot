const   config = require('./config'); // Get the token from a config.json
const   Discord = require('discord.js'); // Import the discord.js module
const   fs = require('fs');
const   client = new Discord.Client(); // Create an instance of a Discord client

let isReady = true; //Bool to check if the bot is speaking
let songsDict = getSongList();

client.login(config.botToken); // Log our bot in

client.on('ready', () => {
  client.user.setActivity(`Koh Lanta`);
  console.log(`Ready to serve on ${client.guilds.size} servers, for ${client.users.size} users.`);
});

client.on('message', message => {
  if(message.author.bot) //Avoid self repeat
      return;

  if(songsDict.hasOwnProperty(message.content.toLowerCase()) && isReady)
      play_song(message, songsDict);
  else
      return;
});

client.on('error', error => {
  console.error(error);
});

function getSongList() {
  let folder = "./mp3/";
  let files = fs.readdirSync(folder); // Sync but only called once
  let songs = {};
  // Command is ./
  for (let i = 0; i < files.length; i++) {
    if (files[i].slice(-4) === ".mp3") {
      let command = "./" + files[i].slice(0, -4);
      let mp3 = "./mp3/" + files[i];
      songs[command] = mp3;
    }
  }
  // Some special case
  songs['ha'] = './mp3/ah.mp3';
  songs['ah'] = './mp3/ah.mp3';
  songs['<:ha:311864943047737344>'] = './mp3/AH.mp3';
  return songs;
}

function error_no_perm (err){
  isReady = true;
  console.error(new Date().toISOString() + '\n' + err.message + '\n' + err.stack);
}

function play_song(message, songs)
{
  if (message.member.voiceChannel) 
    {
      let file = songs[message.content.toLowerCase()];
      isReady = false;
      if (!fs.existsSync(file))
        return;
      message.member.voiceChannel.join().then(connection => { // Connection is an instance of VoiceConnection
        let time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        console.log("[" + time + "]" + " " + file +  " sent by " + message.author.username + " on Guild " + message.guild);
        const dispatcher = connection.playFile(file, {
          passes: 5
        });
        dispatcher.on('error', e => {
            console.error(e);
        });
        dispatcher.on('end', () => { //Disconnect the bot after playing the sound
            connection.disconnect();
            isReady = true;
            dispatcher.destroy();
        });
      }).catch(err => {
        error_no_perm();
        console.error(err);
      });
    } 
    else 
      return;
}
