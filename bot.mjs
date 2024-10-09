// bot.mjs

import { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import fetch from 'node-fetch';

import dotenv from 'dotenv';

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

            const user_data = selected_profile.data
            const slayer_data = user_data.slayer.slayers
            // Fetch info from the JSON data
            // Dungeons data
            const secrets = user_data.dungeons.secrets_found;
            const level = user_data.dungeons.catacombs.level.level;
            const selectedClass = user_data.dungeons.classes.selected_class;
            // Accessories data
            const MagicPower = user_data.accessories.magical_power.total;
            const class_average = user_data.dungeons.classes.average_level;

            const completitions = user_data.dungeons.catacombs.completions;


            // Declare variables outside the try block so they are accessible later
            let floor7completitions = 0, floor7pb = 0;
            let master3completitions = 0, master3pb = 0;
            let master4completitions = 0, master4pb = 0;
            let master5completitions = 0, master5pb = 0;
            let master6completitions = 0, master6pb = 0;
            let master7completitions = 0, master7pb = 0;

            // Fetch dungeon data and handle errors for each block
            try {
                floor7completitions = user_data.dungeons.catacombs.floors[7].stats.tier_completions;
                floor7pb = user_data.dungeons.catacombs.floors[7].stats.fastest_time_s_plus;
            } catch (error) {

            }

            try {
                master3completitions = user_data.dungeons.master_catacombs.floors[3].stats.tier_completions;
                master3pb = user_data.dungeons.master_catacombs.floors[3].stats.fastest_time_s_plus;
            } catch (error) {

            }

            try {
                master4completitions = user_data.dungeons.master_catacombs.floors[4].stats.tier_completions;
                master4pb = user_data.dungeons.master_catacombs.floors[4].stats.fastest_time_s_plus;
            } catch (error) {

            }

            try {
                master5completitions = user_data.dungeons.master_catacombs.floors[5].stats.tier_completions;
                master5pb = user_data.dungeons.master_catacombs.floors[5].stats.fastest_time_s_plus;
            } catch (error) {

            }

            try {
                master6completitions = user_data.dungeons.master_catacombs.floors[6].stats.tier_completions;
                master6pb = user_data.dungeons.master_catacombs.floors[6].stats.fastest_time_s_plus;
            } catch (error) {

            }

            try {
                master7completitions = user_data.dungeons.master_catacombs.floors[7].stats.tier_completions;
                master7pb = user_data.dungeons.master_catacombs.floors[7].stats.fastest_time_s_plus;
            } catch (error) {


            }



            embed.addFields({ name: 'Catacombs Level', value: level.toString(), inline: false },)
            embed.addFields({ name: 'Total secrets Found', value: secrets.toString(), inline: false },)
            embed.addFields({ name: 'Class', value: selectedClass.toString(), inline: false });
            embed.addFields({ name: 'Magic Power', value: MagicPower.toString(), inline: false });
            embed.addFields({ name: 'Class Average', value: class_average.toString(), inline: false });
            embed.addFields({ name: 'F7 stats', value: `Completions: ${floor7completitions.toString()}, PB: ${floor7pb.toString()}`, inline: false });
            embed.addFields({ name: 'M3 stats', value: `Completions: ${master3completitions.toString()} || PB: ${master3pb.toString()}`, inline: false });
            embed.addFields({ name: 'M4 stats', value: `Completions: ${master4completitions.toString()} || PB: ${master4pb.toString()}`, inline: false });
            embed.addFields({ name: 'M5 stats', value: `Completions: ${master5completitions.toString()} || PB: ${master5pb.toString()}`, inline: false });
            embed.addFields({ name: 'M6 stats', value: `Completions: ${master6completitions.toString()} || PB: ${master6pb.toString()}`, inline: false });
            embed.addFields({ name: 'M7 stats', value: `Completions: ${master7completitions.toString()} || PB: ${master7pb.toString()}`, inline: false });
            embed.addFields({ name: 'Completions', value: completitions.toString(), inline: false });



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