import { Guild, PermissionResolvable, Permissions } from "discord.js";

export const checkPermissions = (guild: Guild, permissions: number[]) => {
  return permissions
    .map((permission: PermissionResolvable) => {
      if (guild === null) return false;
      if (guild.me === null) return false;

      return guild.me.hasPermission(permission);
    })
    .every((val) => val === true);
};
