// bot.mjs

import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';

// Initialize the Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Your bot token
const token = 'Token';

// Command prefix
const prefix = '!prova';

// Event listener for when the bot is ready
client.once('ready', () => {
    console.log('Bot is online!');
});

// Event listener for messages
client.on('messageCreate', async message => {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Check if the message starts with the command prefix
    if (message.content.startsWith(prefix)) {
        // Extract the username from the message
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const username = args[0];

        if (!username) {
            message.channel.send('Please provide a username.');
            return;
        }

        try {
            // Fetch data from the SkyCrypt API
            // Refresh API Cache for the user
            await fetch(`https://sky.shiiyu.moe/stats/${username}`);
            const response = await fetch(`https://sky.shiiyu.moe/api/v2/dungeons/${username}`);
            const rawText = await response.text();




            // Parse the raw text as JSON
            const data = JSON.parse(rawText);

            // Extract the relevant profile data
            let selected_profile = null;
            const profiles = data.profiles;
            // Iterate over all profiles to find the highest data
            Object.values(profiles).forEach(profile => {

                try {
                    if (profile.selected) {
                        selected_profile = profile;

                    }
                }
                catch (error) {
                    console.error('Error parsing profile data:', error);
                    return;
                }
            });




            if (!selected_profile) {
                message.channel.send('The API returned incomplete data.');
                return;
            }


            const embed = new EmbedBuilder()
                .setTitle(`Dungeons Information for ${username}`)
                .setColor(0x00AE86)

                .setTimestamp();



            const secrets = selected_profile.dungeons.secrets_found;
            const level = selected_profile.dungeons.catacombs.level.level;
            embed.addFields({ name: 'Total secrets Found', value: secrets.toString(), inline: false },)
            embed.addFields({ name: 'Level', value: level.toString(), inline: false });
            message.channel.send({ embeds: [embed] });



        } catch (error) {
            console.error('Error fetching data:', error);
            message.channel.send('There was an error fetching the data.');
        }
    }

});

// Log in to Discord with your bot token
client.login(token);