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
    getItems,
    decimalToMinutes
} from './dungeon_functions.mjs';


dotenv.config({ path: './token.env' });

// Fetch info from the JSON data

let secrets = null
let level = null
let selectedClass = null
let MagicPower = null
let class_average = null
let completions = null
let floor7completions = null
let floor7pb = null
let master3completions = null
let master3pb = null
let master4completions = null
let master4pb = null
let master5completions = null
let master5pb = null
let master6completions = null
let master6pb = null
let master7completions = null
let master7pb = null
let HypeText = "<:hyperionpng:1285284808033046529> <:no:1285292201865117870>"
let TermText = "<:terminatorpng:1285289299536904213> <:no:1285292201865117870>"
let items = []



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



            const F7Button = new ButtonBuilder()
                .setCustomId('f7')
                .setLabel('Floor 7')
                .setStyle(ButtonStyle.Primary);

            const M3Button = new ButtonBuilder()
                .setCustomId('m3')
                .setLabel('Master 3')
                .setStyle(ButtonStyle.Primary);

            const M4Button = new ButtonBuilder()
                .setCustomId('m4')
                .setLabel('Master 4')
                .setStyle(ButtonStyle.Primary);

            const M5Button = new ButtonBuilder()
                .setCustomId('m5')
                .setLabel('Master 5')
                .setStyle(ButtonStyle.Primary);

            const M6Button = new ButtonBuilder()
                .setCustomId('m6')
                .setLabel('Master 6')
                .setStyle(ButtonStyle.Primary);

            const M7Button = new ButtonBuilder()
                .setCustomId('m7')
                .setLabel('Master 7')
                .setStyle(ButtonStyle.Primary);


            const row1 = new ActionRowBuilder()
                .addComponents(F7Button, M3Button, M4Button, M5Button, M6Button);

            const row2 = new ActionRowBuilder()
                .addComponents(M7Button);




            const embed = new EmbedBuilder()
                .setTitle(`Dungeons Information for ${username}`)
                .setColor(0x00AE86)

                .setTimestamp();


            // Fetch info from the JSON data
            // Dungeons data
            secrets = getSecrets(selected_profile);
            level = getCataLevel(selected_profile);
            selectedClass = getSelectedClass(selected_profile);

            MagicPower = getMagicalPower(selected_profile);
            class_average = getClassAverage(selected_profile);
            completions = getCompletions(selected_profile);


            floor7completions = getFloor7Completions(selected_profile);
            floor7pb = decimalToMinutes(getFloor7PB(selected_profile));
            master3completions = getMaster3Completions(selected_profile);
            master3pb = decimalToMinutes(getMaster3PB(selected_profile));
            master4completions = getMaster4Completions(selected_profile);
            master4pb = decimalToMinutes(getMaster4PB(selected_profile));
            master5completions = getMaster5Completions(selected_profile);
            master5pb = decimalToMinutes(getMaster5PB(selected_profile));
            master6completions = getMaster6Completions(selected_profile);
            master6pb = decimalToMinutes(getMaster6PB(selected_profile));
            master7completions = getMaster7Completions(selected_profile);
            master7pb = decimalToMinutes(getMaster7PB(selected_profile));
            HypeText = ""
            TermText = ""
            items = getItems(selected_profile);


            for (let i = 0; i < items.length; i++) {
                if (items[i].includes("Astraea")) {
                    HypeText = "<:hyperionpng:1285284808033046529> <:checkmark1:1290354117771919360>"

                }

                if (items[i].includes("Terminator")) {
                    TermText = "<:terminatorpng:1285289299536904213> <:checkmark1:1290354117771919360>"
                }

            }

            // check if "hyperion" is in items










            embed.addFields({ name: 'Catacombs Levels and Stats', value: `Catacomb Level: ${level.toString()} \nClass Average: ${class_average.toString()} \nSelected Class: ${selectedClass.toString()} \nMagical Power: ${MagicPower.toString()}`, inline: false },)
            embed.addFields({ name: 'Total secrets Found', value: `Secrets: ${secrets.toString()}`, inline: false },)
            embed.addFields({
                name: 'Completitions and PB',
                value: `COMPLETITIONS // PB 
            F7: ${floor7completions ?? 0} // ${floor7pb ?? 0} 
            M3: ${master3completions ?? 0} // ${master3pb ?? 0} 
            M4: ${master4completions ?? 0} // ${master4pb ?? 0} 
            M5: ${master5completions ?? 0} // ${master5pb ?? 0} 
            M6: ${master6completions ?? 0} // ${master6pb ?? 0} 
            M7: ${master7completions ?? 0} // ${master7pb ?? 0}`,
                inline: false
            });
            embed.addFields({ name: 'Relevant Items', value: `${HypeText} \n${TermText}`, inline: false });



            message.channel.send({ embeds: [embed], components: [row1, row2] });


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

    if (interaction.customId === 'f7') {
        // Handle the button logic here
        const embed = new EmbedBuilder()
            .setTitle(`Dungeons Information for ${username}`)
            .setColor(0x00AE86)

            .setTimestamp();



        await interaction.reply({ content: 'Prova' });
        await interaction.message.delete(); // Deletes the message with the button
    }
});



// Log in to Discord with your bot token
client.login(token);