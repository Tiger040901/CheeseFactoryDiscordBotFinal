// bot.mjs

import { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import fetch from 'node-fetch';

// Initialize the Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Your bot token
const token = 'token';

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
            const slayer_data = selected_profile.data.slayer.slayers
            // Fetch info from the JSON data
            // Dungeons data
            const secrets = user_data.dungeons.secrets_found;
            const level = user_data.dungeons.catacombs.level.level;
            const selectedClass = user_data.dungeons.classes.selected_class;
            // Accessories data
            const MagicPower = user_data.accessories.magical_power.total;
            // Slayers data
            const Revenant = slayer_data.zombie.level.currentLevel;
            const Enderman = slayer_data.enderman.level.currentLevel;
            const Tarantula = slayer_data.spider.level.currentLevel;
            const Sven = slayer_data.wolf.level.currentLevel;
            const blaze = slayer_data.blaze.level.currentLevel;

            embed.addFields({ name: 'Catacombs Level', value: level.toString(), inline: false },)
            embed.addFields({ name: 'Total secrets Found', value: secrets.toString(), inline: false },)
            embed.addFields({ name: 'Class', value: selectedClass.toString(), inline: false });
            embed.addFields({ name: 'Magic Power', value: MagicPower.toString(), inline: false });
            embed.addFields({ name: 'Revenant', value: Revenant.toString(), inline: false });
            embed.addFields({ name: 'Enderman', value: Enderman.toString(), inline: false });
            embed.addFields({ name: 'Tarantula', value: Tarantula.toString(), inline: false });
            embed.addFields({ name: 'Sven', value: Sven.toString(), inline: false });
            embed.addFields({ name: 'Blaze', value: blaze.toString(), inline: false });

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