import { Client, VoiceState } from 'discord.js';
import { getActive, getAnnouncement, getGlobalCooldown, setLastPlayed } from "../../db";

import ytdl from 'ytdl-core';

export const onVoiceStateUpdate = (app: Client) => async (oldMember: VoiceState, newMember: VoiceState) => {
    const newMemberChannel = newMember.channel;
    const oldMemberChannel = oldMember.channel;
    console.info(`${newMember.member?.displayName}(${newMember.id}) joined ${newMemberChannel?.name} from ${oldMemberChannel?.name}`);

    if (oldMemberChannel !== newMemberChannel && newMemberChannel !== null) {
        const checkActive = await getActive("announceArrival");
        if (newMemberChannel.members.size < 2 || checkActive == false) return;
        const maybeAnnouncmentData = await getAnnouncement(newMember.id);
        if (maybeAnnouncmentData !== null) {
            const lastPlayed = await maybeAnnouncmentData.lastPlayed;
            const globalCooldown = await getGlobalCooldown();
            const streamVolume = await maybeAnnouncmentData.volume;
            console.info(`Now: ${Date.now()} Last Played: ${lastPlayed} Cooldown: ${globalCooldown}s Cooldown left: ${(lastPlayed + globalCooldown * 1000 - Date.now()) / 1000}s`);
            if (Date.now() < lastPlayed + (globalCooldown * 1000)) {
                console.info(`${newMember.member?.displayName} is still on cooldown`);
                return;
            }
            const streamOptions = { seek: 0, volume: streamVolume };
            newMemberChannel.join().then(connection => {
                console.info(`BOT joined channel ${newMemberChannel.name}`);
                const stream = ytdl(maybeAnnouncmentData.audioUrl, { filter: 'audioonly' });
                console.info(`playing ${maybeAnnouncmentData.audioUrl} for user: ${newMember.member?.displayName}(${newMember.id}) at volume ${streamVolume}`);
                const dispatcher = connection.play(stream, streamOptions);
                dispatcher.on("finish", () => {
                    setLastPlayed(newMember.id, Date.now());
                    console.info(`BOT leaving channel ${connection.channel.name}`);
                    connection.channel.leave();
                });
            }).catch(err => console.error(err));
        }
    }
}