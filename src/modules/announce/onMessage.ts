import { Message, Client, PresenceData } from 'discord.js';
import { deleteMessageIfAble } from "../../helpers/msgDelete";
import { setActive, setGlobalCooldown, setVolume } from "../../db";

import ytdl from 'ytdl-core';

export const onMessage = (app: Client) => async (message: Message) => {
    if (message.author.bot) return;

    if (message.content.startsWith("!ping")) {
        console.info(`[in][${message.author.username}] ${message.content}`);
        const responseMessage = await message.channel.send("Pong!");
        console.info(`[out][${message.guild?.me?.user.username}] ${responseMessage.content}`);
        deleteMessageIfAble(message);
    }

    if (message.content.startsWith("!test")) {
        const streamOptions = { seek: 0, volume: 1 };
        if (message.member == null) return;
        const voiceChannel = message.member.voice.channel
        if (voiceChannel && message.member.permissions.has("ADMINISTRATOR")) {
            voiceChannel.join().then(connection => {
                console.info(`BOT joined channel ${voiceChannel}`);
                const stream = ytdl("https://www.youtube.com/watch?v=jLtbFWJm9_M", { filter: 'audioonly' });
                const dispatcher = connection.play(stream, streamOptions);
                dispatcher.on("finish", () => {
                    console.info(`BOT leaving channel ${connection.channel}`);
                    connection.channel.leave();
                });
            }).catch(err => console.error(err));
        }
        deleteMessageIfAble(message);
    }

    if (message.content.startsWith("!boton")) {
        if (message.member != null && message.member.permissions.has("ADMINISTRATOR")) {
            setActive(true, "announceArrival");
            const presence: PresenceData = {
                afk: false,
                activity: {
                    name: 'arrivals',
                    type: 'WATCHING',
                },
                status: 'online',
            };

            // Set presence message
            if (app.user != null) {
                app.user.setPresence(presence)
                    .catch(console.warn);
            }
        }
        deleteMessageIfAble(message);
    }

    if (message.content.startsWith("!botoff")) {
        if (message.member != null && message.member.permissions.has("ADMINISTRATOR")) {
            setActive(false, "announceArrival");
            const presence:PresenceData = {
                afk: true,
                activity: {
                    name: 'commands',
                    type: 'LISTENING',
                },
                status: 'dnd',
            };

            // Set presence message
            if (app.user != null) {
                app.user.setPresence(presence)
                    .catch(console.warn);
            }
        }
        deleteMessageIfAble(message);
    }

    if (message.content.startsWith("!volume")) {
        if (message.member != null && message.member.permissions.has("ADMINISTRATOR")) {
            const mention = message.mentions.users.first();
            if (!mention) {
                console.error("No user referenced");
                deleteMessageIfAble(message);
                return;
            }
            const args = message.content.slice(7).trim().split(' ');
            const userId = mention.id;
            const volume = parseFloat(args[1]);
            setVolume(userId, volume);
        }
        deleteMessageIfAble(message);
    }

    if (message.content.startsWith("!cd")) {
        if (message.member != null && message.member.permissions.has("ADMINISTRATOR")) {
            const args = message.content.slice(3).trim().split(' ');
            const cooldown = parseFloat(args[0]);
            setGlobalCooldown(cooldown);
        }
        deleteMessageIfAble(message);
    }
}