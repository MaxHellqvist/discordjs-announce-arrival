import { Message, Permissions } from "discord.js";
import { checkPermissions } from "./checkPermissions";

export const deleteMessageIfAble = (msg: Message) => {
  if (msg.deletable === false) return;
  if (msg.guild === null) return;
  if (
    checkPermissions(msg.guild, [Permissions.FLAGS.MANAGE_MESSAGES]) === false
  ) {
    return;
  }

  msg.delete().catch(console.error);
};
