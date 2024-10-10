// bot.mjs

import { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import fetch from 'node-fetch';

import dotenv from 'dotenv';

import {
    getCataLevel,
    getSecrets,
    getClassAverage,
    getCompletions,
    getMagicalPower,
    getSelectedClass,
    getFloor7Completions,
    getFloor7PB,
    getMaster3Completions,
    getMaster3PB,
    getMaster4Completions,
    getMaster4PB,
    getMaster5Completions,
    getMaster5PB,
    getMaster6Completions,
    getMaster6PB,
    getMaster7Completions,
    getMaster7PB,
    checkIfAOTV
} from './dungeon_functions.mjs';


dotenv.config({ path: './token.env' });




// Initialize the Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Your bot token
const token = process.env.TOKEN;

// Command prefix
const prefix = '!dungeons';

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
            const response = await fetch(`https://sky.shiiyu.moe/api/v2/profile/${username}`);
            const rawText = await response.text();




            // Parse the raw text as JSON
            const data = JSON.parse(rawText);

            // Extract the relevant profile data
            let selected_profile = null;
            const profiles = data.profiles;
            // Iterate over all profiles to find the highest data
            Object.values(profiles).forEach(profile => {

                try {
                    if (profile.current) {
                        selected_profile = profile;
                    }
                }
                catch (error) {
                    console.error('Error parsing profile data:', error);
                }
            });




            if (!selected_profile) {
                message.channel.send('The API returned incomplete data.');
                return;
            }



            const provaButton = new ButtonBuilder()
                .setCustomId('prova')
                .setLabel('Prova')
                .setStyle(ButtonStyle.Primary);


            const row = new ActionRowBuilder()
                .addComponents(provaButton);




            const embed = new EmbedBuilder()
                .setTitle(`Dungeons Information for ${username}`)
                .setColor(0x00AE86)

                .setTimestamp();


            // Fetch info from the JSON data
            // Dungeons data
            const secrets = getSecrets(selected_profile);
            const level = getCataLevel(selected_profile);
            const selectedClass = getSelectedClass(selected_profile);
            // Accessories data
            const MagicPower = getMagicalPower(selected_profile);
            const class_average = getClassAverage(selected_profile);
            const completions = getCompletions(selected_profile);


            const floor7completions = getFloor7Completions(selected_profile);
            const floor7pb = getFloor7PB(selected_profile);
            const master3completions = getMaster3Completions(selected_profile);
            const master3pb = getMaster3PB(selected_profile);
            const master4completions = getMaster4Completions(selected_profile);
            const master4pb = getMaster4PB(selected_profile);
            const master5completions = getMaster5Completions(selected_profile);
            const master5pb = getMaster5PB(selected_profile);
            const master6completions = getMaster6Completions(selected_profile);
            const master6pb = getMaster6PB(selected_profile);
            const master7completions = getMaster7Completions(selected_profile);
            const master7pb = getMaster7PB(selected_profile);

            const aotv = checkIfAOTV(selected_profile);




            embed.addFields({ name: 'Catacombs Level', value: level.toString(), inline: false },)
            embed.addFields({ name: 'Total secrets Found', value: secrets.toString(), inline: false },)
            embed.addFields({ name: 'Class', value: selectedClass.toString(), inline: false });
            embed.addFields({ name: 'Magic Power', value: MagicPower.toString(), inline: false });
            embed.addFields({ name: 'Class Average', value: class_average.toString(), inline: false });
            embed.addFields({ name: 'F7 stats', value: `Completions: ${floor7completions.toString()}, PB: ${floor7pb.toString()}`, inline: false });
            embed.addFields({ name: 'M3 stats', value: `Completions: ${master3completions.toString()} || PB: ${master3pb.toString()}`, inline: false });
            embed.addFields({ name: 'M4 stats', value: `Completions: ${master4completions.toString()} || PB: ${master4pb.toString()}`, inline: false });
            embed.addFields({ name: 'M5 stats', value: `Completions: ${master5completions.toString()} || PB: ${master5pb.toString()}`, inline: false });
            embed.addFields({ name: 'M6 stats', value: `Completions: ${master6completions.toString()} || PB: ${master6pb.toString()}`, inline: false });
            embed.addFields({ name: 'M7 stats', value: `Completions: ${master7completions.toString()} || PB: ${master7pb.toString()}`, inline: false });
            embed.addFields({ name: 'Completions', value: completions.toString(), inline: false });
            embed.addFields({ name: 'AOTV', value: aotv ? 'Yes' : 'No', inline: false });



            message.channel.send({ embeds: [embed], components: [row] });


            //handle button listener




        } catch (error) {
            console.error('Error fetching data:', error);
            message.channel.send('There was an error fetching the data.');
        }
    }

});


// Handle button interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'prova') {
        // Handle the button logic here
        await interaction.reply({ content: 'Prova' });
        await interaction.message.delete(); // Deletes the message with the button
    }
});



// Log in to Discord with your bot token
client.login(token);