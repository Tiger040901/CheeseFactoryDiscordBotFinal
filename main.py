
import discord
from discord import app_commands
import base64
import requests
import json
from discord.ext import commands
import nbtlib
from nbtlib.tag import List, Compound
import nbt
import io
import json

import time
import datetime

hyperion = 1285284808033046529
terminator = 1285289299536904213
no = 1285292201865117870
star = 1290264551841071104


key = "KEY"




def decimalToMinutes(time):
    usetime = time/1000
    return datetime.datetime.fromtimestamp(usetime).strftime('%M:%S')

def GetUUID(username):
    mojangdata = requests.get(f"https://api.mojang.com/users/profiles/minecraft/{username}").json()
    return mojangdata["id"]

def GetHypixelApiData(uuid):
    data = requests.get(f"https://api.hypixel.net/v2/skyblock/profiles?key={key}&uuid={uuid}").json()
    return data


def GetHypixelProfileData(uuid):
   data = requests.get(f"https://api.hypixel.net/v2/player?key={key}&uuid={uuid}").json()
   return data


#FUNCTIONSSSSSS!!!

def base64ToString(b):
    return base64.b64decode(b).decode('utf-8')

def unpack_nbt(tag):
    """
    Unpack an NBT tag into a native Python data structure.
    """
    # Handle NBT List
    if isinstance(tag, List):
        return [unpack_nbt(i) for i in tag]

    # Handle NBT Compound
    elif isinstance(tag, Compound):
        return {key: unpack_nbt(value) for key, value in tag.items() if key}

    # Handle NBTFile-like structures that behave like a dict with named keys
    elif hasattr(tag, 'tags'):
        # Handle unnamed tags by ignoring them or providing placeholders
        return {t.name if t.name else f"{i}": unpack_nbt(t) for i, t in enumerate(tag.tags)}

    # Handle primitive values (numbers, strings, etc.)
    else:
        return tag.value

def decode_inventory_data(raw):
    """
    Decode base64 encoded NBT data and unpack it into a Python object.
    """
    try:
        # Decode base64 NBT data into an NBTFile object
        nbt_data = nbt.nbt.NBTFile(fileobj=io.BytesIO(base64.b64decode(raw)))
        return unpack_nbt(nbt_data)
    except Exception as e:
        print(f"Error decoding NBT data: {e}")
        return None
    
# Function to recursively convert NBT data into JSON-serializable format
def make_serializable(obj):
    if isinstance(obj, dict):
        return {k: make_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [make_serializable(i) for i in obj]
    elif hasattr(obj, 'to_obj'):
        return obj.to_obj()  # For any custom objects with a to_obj method
    else:
        return obj  # Return the object directly if it's a primitive type





bot = commands.Bot(command_prefix="!", intents=discord.Intents.all())

@bot.event
async def on_ready():
  print("Bot is ready")
  
@bot.command()
async def sync(ctx):
  synced = await ctx.bot.tree.sync()
  await ctx.send(f"Synced {len(synced)}")


@bot.tree.command(name="username")
@app_commands.describe(username="Quale è il tuo username?")
async def username(interaction: discord.Interaction, username:str):
  await interaction.response.defer()

  try:
    
    uuid = GetUUID(username)
    discord_from_hypixel = GetHypixelProfileData(uuid)["player"]["socialMedia"]["links"]["DISCORD"]
    if str(interaction.user) == discord_from_hypixel:
         


      #VALUES
      has_hype=False
      has_term=False





      
      data = GetHypixelApiData(uuid)

      invB64 = []
      #RETRIEVE DATA FROM INVENTORY AND ECHEST
      for profile in data["profiles"]:
        try:
            invB64.append(profile["members"][uuid]["inventory"]["inv_contents"]["data"])
            invB64.append(profile["members"][uuid]["inventory"]["ender_chest_contents"]["data"])
        except Exception as e:
            pass
          

      inventory_data = []
      for i in invB64:
        inventory_data.append(decode_inventory_data(i))



      serializable_data = []
      for i in range(len(invB64)):
        serializable_data.append(make_serializable(inventory_data[i]))



      wither_impact_weapon = []
      term = []
      hype_stars = 0
      hype_mstars = 0
      term_stars = 0
      term_mstars = 0
      for i in serializable_data:
        try:
          for j in range(10000):  # Adjust based on your item structure depth
            item = i["i"][str(j)]["tag"]["display"]["Name"]
            splittata = item.split()

            for k in splittata:
              if k == "Hyperion" or k =="Astraea" or k == "Scylla" or k == "Valkyrie":
                wither_impact_weapon.append("Hyperion")
                if len(splittata) > 2:

                  if splittata[2].count("\u278a") == 1:
                     hype_mstars = 1
                     hype_stars = 5
                  elif splittata[2].count("\u278b") == 1:
                     hype_mstars = 2
                     hype_stars = 5
                  elif splittata[2].count("\u278c") == 1:
                     hype_mstars = 3
                     hype_stars = 5
                  elif splittata[2].count("\u278d") == 1:
                     hype_mstars = 4
                     hype_stars = 5
                  elif splittata[2].count("\u278e") == 1:
                     hype_mstars = 5
                     hype_stars = 5
                  else:
                     hype_stars = splittata[2].count("\u272a")

              elif k == "Terminator":
                term.append("Terminator")
                if len(splittata) > 2:
                  if splittata[2].count("\u278a") == 1:
                     term_mstars = 1
                     term_stars = 5
                  elif splittata[2].count("\u278b") == 1:
                     term_mstars = 2
                     term_stars = 5
                  elif splittata[2].count("\u278c") == 1:
                     term_mstars = 3
                     term_stars = 5
                  elif splittata[2].count("\u278d") == 1:
                     term_mstars = 4
                     term_stars = 5
                  elif splittata[2].count("\u278e") == 1:
                     term_mstars = 5 
                     term_stars = 5


        except Exception as e:
            pass

      # Check results
      if len(wither_impact_weapon) > 0:
        has_hype = True

      if len(term) > 0:
        has_term = True

      if has_hype:
        has_hype_text = f"<:checkmark1:1290354117771919360> Wither Impact Weapon {hype_stars+hype_mstars}<:WhiteStar1:1290270125970292747>"

      else:
         has_hype_text = f"<:no:1285292201865117870>"
      if has_term:
        has_term_text = f"<:checkmark1:1290354117771919360> Terminator {term_stars+term_mstars}<:WhiteStar1:1290270125970292747> "


      else:
         has_term_text = f"<:no:1285292201865117870>"



      mp_list = []
      for profile in data["profiles"]:
        try:
          mp_list.append(profile["members"][uuid]["accessory_bag_storage"]["highest_magical_power"])
        except Exception:
          pass


      mp_list.sort(reverse=True)
      try:
        highest_mp = mp_list[0]
      except Exception:
         highest_mp = 0



      #CATA
      catacombs= [50 ,75 ,110 ,160 ,230 ,330 ,470 ,670 ,950 ,1340 ,1890 ,2665 ,3760 ,5260 ,7380 ,10300 ,14400 ,20000 ,27600 ,38000 ,52500 ,71500 ,97000 ,132000 ,180000 ,243000 ,328000 ,445000 ,600000 ,800000 ,1065000 ,1410000 ,1900000 ,2500000 ,3300000 ,4300000 ,5600000 ,7200000 ,9200000 ,12000000 ,15000000 ,19000000 ,24000000 ,30000000 ,38000000 ,48000000 ,60000000 ,75000000 ,93000000 ,116250000 ]
      dungeonLevels = []
      dungeonLevelsFinal = []

      for profile in data["profiles"]:
          try:
            dungeonLevels.append(profile["members"][uuid]["dungeons"]["dungeon_types"]["catacombs"]["experience"])
          except Exception as e:
            pass

      for dungeonLvl in dungeonLevels:
        val = 0
        for i in range(50):
          val += catacombs[i]
          if val > dungeonLvl:
            dungeonLevelsFinal.append(i)
            break
      dungeonLevelsFinal.sort(reverse=True)
      dungeonLevelInTheEnd = int(dungeonLevelsFinal[0])


      levels = []
      for profile in data["profiles"]:
          try:
            levels.append(profile["members"][uuid]["leveling"]["experience"])
          except Exception as e:
            pass
      finalLevels=[]

      for level in levels:
        try:
          res = [int(x) for x in str(level)]


          res.reverse()
          res.pop(0)
          res.pop(0)
          res.reverse()
          finalString = ""
          for i in res:
            finalString += str(i)
          finalLevels.append(int(finalString))
        except Exception:
           pass
         
         
      finalLevels.sort(reverse=True)

      levelInTheEnd = finalLevels[0]




      #profile["members"][uuid]["inventory"]["inv_contents"]["data"]
      floor7completitions = []
      for profile in data["profiles"]:
        try:
            floor7completitions.append(profile["members"][uuid]["dungeons"]["dungeon_types"]["catacombs"]["tier_completions"]["7"])
        except Exception:
            pass
      try:
        floor7completitions.sort(reverse=True)
        floor7completitionsFinal = int(floor7completitions[0])     
      except Exception:
        floorm7completitionsFinal = 0

      floorm3completitions = []
      for profile in data["profiles"]:
        try:
            floorm3completitions.append(profile["members"][uuid]["dungeons"]["dungeon_types"]["master_catacombs"]["tier_completions"]["3"])
        except Exception:
            pass
      try:
        floorm3completitions.sort(reverse=True)
        floorm3completitionsFinal = int(floorm3completitions[0])     
      except Exception:
        floorm3completitionsFinal = 0



      floorm4completitions = []
      for profile in data["profiles"]:
        try:
          floorm4completitions.append(profile["members"][uuid]["dungeons"]["dungeon_types"]["master_catacombs"]["tier_completions"]["4"])
        except Exception:
          pass
      try:
        floorm4completitions.sort(reverse=True)
        floorm4completitionsFinal = int(floorm4completitions[0])     
      except Exception:
        floorm4completitionsFinal = 0


      floorm5completitions = []
      for profile in data["profiles"]:
        try:
          floorm5completitions.append(profile["members"][uuid]["dungeons"]["dungeon_types"]["master_catacombs"]["tier_completions"]["5"])
        except Exception:
          pass
      try:
        floorm5completitions.sort(reverse=True)
        floorm5completitionsFinal = int(floorm5completitions[0])

      except Exception:
        floorm5completitionsFinal = 0



      floorm6completitions = []
      for profile in data["profiles"]:
        try:
            floorm6completitions.append(profile["members"][uuid]["dungeons"]["dungeon_types"]["master_catacombs"]["tier_completions"]["6"])
        except Exception:
            pass
      try:
        floorm6completitions.sort(reverse=True)
        floorm6completitionsFinal = int(floorm6completitions[0])

      except Exception:
        floorm6completitionsFinal = 0



      floorm7completitions = []
      for profile in data["profiles"]:
        try:
            floorm7completitions.append(profile["members"][uuid]["dungeons"]["dungeon_types"]["master_catacombs"]["tier_completions"]["7"])
        except Exception:
            pass
      try:
        floorm7completitions.sort(reverse=True)
        floorm7completitionsFinal = int(floorm7completitions[0])      
      except Exception:
        floorm7completitionsFinal = 0






      secrets = []
      for profile in data["profiles"]:
        try:
            secrets.append(profile["members"][uuid]["dungeons"]["secrets"])
        except Exception:
            pass

      secrets.sort(reverse=True)
      try:
        highest_secrets = secrets[0]
      except Exception:
         highest_secrets = 0


      bestf7runs = []
      timesf7 = []
      #len(profile["members"][uuid]["dungeons"]["dungeon_types"]["catacombs"]["best_runs"]["7"]
      for profile in data["profiles"]:
        try:
          bestf7runs.append(profile["members"][uuid]["dungeons"]["dungeon_types"]["catacombs"]["fastest_time_s_plus"]["7"])

        except Exception as e:
          pass





      bestf7runs.sort()
      try:
        bestf7run = decimalToMinutes(bestf7runs[0])
      except Exception:
         bestf7run = "None"






      bestm3runs = []
      timesm3 = []
      #len(profile["members"][uuid]["dungeons"]["dungeon_types"]["catacombs"]["best_runs"]["7"]
      for profile in data["profiles"]:
        try:
          bestm3runs.append(profile["members"][uuid]["dungeons"]["dungeon_types"]["master_catacombs"]["fastest_time_s_plus"]["3"])

        except Exception as e:
          pass




      bestm3runs.sort()
      try:
        bestm3run = decimalToMinutes(bestm3runs[0])
      except Exception:
         bestm3run = "None"


      bestm4runs = []
      timesm4 = []
      #len(profile["members"][uuid]["dungeons"]["dungeon_types"]["catacombs"]["best_runs"]["7"]
      for profile in data["profiles"]:
        try:
          bestm4runs.append((profile["members"][uuid]["dungeons"]["dungeon_types"]["master_catacombs"]["fastest_time_s_plus"]["4"]))

        except Exception as e:
          pass





      bestm4runs.sort()
      try:
        bestm4run = decimalToMinutes(bestm4runs[0])
      except Exception:
         bestm4run = "None"



      bestm5runs = []

      #len(profile["members"][uuid]["dungeons"]["dungeon_types"]["catacombs"]["best_runs"]["7"]
      for profile in data["profiles"]:
        try:
          bestm5runs.append((profile["members"][uuid]["dungeons"]["dungeon_types"]["master_catacombs"]["fastest_time_s_plus"]["5"]))

        except Exception as e:
          pass




      bestm5runs.sort()
      try:
        bestm5run = decimalToMinutes(bestm5runs[0])
      except Exception:
         bestm5run = "None"


      bestm6runs = []
      timesm6 = []
      #len(profile["members"][uuid]["dungeons"]["dungeon_types"]["catacombs"]["best_runs"]["7"]
      for profile in data["profiles"]:
        try:
          bestm6runs.append((profile["members"][uuid]["dungeons"]["dungeon_types"]["master_catacombs"]["fastest_time_s_plus"]["6"]))
        except Exception:  
          pass




      bestm6runs.sort()
      try:
        bestm6run = decimalToMinutes(bestm6runs[0])
      except Exception:
         bestm6run = "None"


      bestm7runs = []
      timesm7 = []
      #len(profile["members"][uuid]["dungeons"]["dungeon_types"]["catacombs"]["best_runs"]["7"]
      for profile in data["profiles"]:
        try:
          bestm7runs.append((profile["members"][uuid]["dungeons"]["dungeon_types"]["master_catacombs"]["fastest_time_s_plus"]["7"]))

        except Exception as e:
          pass





      bestm7runs.sort()
      try:
        bestm7run = decimalToMinutes(bestm7runs[0])
      except Exception:
         bestm7run = "None"







      embed = discord.Embed(
        title="Requirement check",
        colour=discord.Colour.dark_blue(),
        description= f"{username}, here are your data"

      )




      embed.add_field(name="Magical Power", value=f"MP: {highest_mp}", inline=False)
      embed.add_field(name="Relevant Items", value=f"<:hyperionpng:{hyperion}>{has_hype_text} \n<:terminator:{terminator}>{has_term_text}" , inline=False)
      embed.add_field(name="Stats", value=f"Level: {levelInTheEnd} \nCata Level:{dungeonLevelInTheEnd}", inline=False)
      embed.add_field(name="Completitions", value=f"Completitions: \nF7: {floor7completitionsFinal} // PB: {bestf7run}\nM3: {floorm3completitionsFinal} // PB: {bestm3run}\nM4: {floorm4completitionsFinal} // PB: {bestm4run}\nM5: {floorm5completitionsFinal} // PB: {bestm5run}\nM6: {floorm6completitionsFinal} // PB: {bestm6run}\nM7:{floorm7completitionsFinal} // PB: {bestm7run}", inline=False)
      embed.add_field(name="Secrets", value=f"Secrets: {highest_secrets}", inline=False) 
      embed.add_field(name="Can Join", value=f":white_check_mark: {username} DOES MEET THE REQUIREMENT TO JOIN THE GUILD! DISCORD ", inline=False)

      await interaction.followup.send(embed=embed)
    else:
       await interaction.followup.send("Error! Your linked discord account is wrong or non existent")
  except Exception:
     await interaction.followup.send("Error! Couldn't find your account")
  

#Data Example: [mp, has_hyperion, hyperion_stars, has_terminator, terminator_stars, level, dungeon_level, floor7_completions, floor7_pb, floor3_completions, floor3_pb, floor4_completions, floor4_pb, floor5_completions, floor5_pb, floor6_completions, floor6_pb, floor7_completions, floor7_pb, secrets]


bot.run("TOKEN")
  