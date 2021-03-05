import "./setup";
import { Client } from "discord.js";
import ytdl from 'ytdl-core';

import { deleteMessageIfAble } from "./helpers/msgDelete";
import { getAnnouncement, registerAnnouncement } from "./db";

// Enable console.debug logs
console.logLevel = process.env.DEPLOY_ENVIRONMENT === "development" ? 4 : 3;

const app = new Client();

app.on("message", async (msg) => {
  if (msg.author.bot) return;
  if (msg.content.startsWith("!ping")) {
    console.info(`[in][${msg.author.username}] ${msg.content}`);
    const responseMsg = await msg.channel.send("Pong!");
    console.info(`[out][${msg.guild?.me?.user.username}] ${responseMsg.content}`);
    deleteMessageIfAble(msg);
  }
  if (msg.content.startsWith("!playtest")) {
    const streamOptions = { seek: 0, volume: 1 };
    if (msg.member == null) return;
    const voiceChannel = msg.member.voice.channel
    if (voiceChannel && msg.member.permissions.has("ADMINISTRATOR")) {
      voiceChannel.join().then(connection => {
        console.info(`BOT joined channel ${voiceChannel}`);
        const stream = ytdl("https://youtu.be/m9zhgDsd4P4", { filter: 'audioonly' });
        const dispatcher = connection.play(stream, streamOptions);
        dispatcher.on("finish", () => {
          console.info(`BOT leaving channel ${connection.channel}`);
          connection.channel.leave();
        });
      }).catch(err => console.error(err));
    }
    deleteMessageIfAble(msg);
  }
});

app.on("voiceStateUpdate", async (oldMember, newMember) => {
  const newMemberChannel = newMember.channel
  const oldMemberChannel = oldMember.channel
  console.info(newMember + " joined " + newMemberChannel + " from " + oldMemberChannel);

  if (oldMemberChannel !== newMemberChannel && newMemberChannel !== null) {
    const maybeAnnouncmentData = await getAnnouncement(newMember.id)
    if (maybeAnnouncmentData !== null) {
      const streamOptions = { seek: 0, volume: 1 };
      newMemberChannel.join().then(connection => {
        console.info(`BOT joined channel ${newMemberChannel}`);
        const stream = ytdl(maybeAnnouncmentData.audioUrl, { filter: 'audioonly' });
        console.info(`playing ${maybeAnnouncmentData.audioUrl} for user:${newMember.id}`);
        const dispatcher = connection.play(stream, streamOptions);
        dispatcher.on("finish", () => {
          console.info(`BOT leaving channel ${connection.channel}`);
          connection.channel.leave();
        });
      }).catch(err => console.error(err));
    }
  }
})

app
  .login(process.env.DISCORD_TOKEN)
  .then(() => console.info("Login successful!"))
  .catch((err) => console.error("Login failed:", err));
