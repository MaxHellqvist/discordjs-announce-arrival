import { Client, VoiceState} from 'discord.js';
import { getActive, getAnnouncement } from "../../db";

import ytdl from 'ytdl-core';

export const onVoiceStateUpdate = (app: Client) => async (oldMember: VoiceState, newMember: VoiceState) => {
    const newMemberChannel = newMember.channel;
    const oldMemberChannel = oldMember.channel;
    console.info(`${newMember.member?.displayName}(${newMember.id}) joined ${newMemberChannel?.name} from ${oldMemberChannel?.name}`);

    if (oldMemberChannel !== newMemberChannel && newMemberChannel !== null) {
        const atleastOneAdmin = newMemberChannel.members.some(member => member.permissions.has("ADMINISTRATOR"));
        const checkActive = await getActive("announceArrival");
        if (!atleastOneAdmin || checkActive == false) return;
        const maybeAnnouncmentData = await getAnnouncement(newMember.id);
        if (maybeAnnouncmentData !== null) {
            const streamVolume = await maybeAnnouncmentData.volume;
            const streamOptions = { seek: 0, volume: streamVolume };
            newMemberChannel.join().then(connection => {
                console.info(`BOT joined channel ${newMemberChannel.name}`);
                const stream = ytdl(maybeAnnouncmentData.audioUrl, { filter: 'audioonly' });
                console.info(`playing ${maybeAnnouncmentData.audioUrl} for user: ${newMember.member?.displayName}(${newMember.id}) at volume ${streamVolume}`);
                const dispatcher = connection.play(stream, streamOptions);
                dispatcher.on("finish", () => {
                    console.info(`BOT leaving channel ${connection.channel.name}`);
                    connection.channel.leave();
                });
            }).catch(err => console.error(err));
        }
    }
}