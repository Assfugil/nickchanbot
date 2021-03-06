const mutedRoles = new (require("keyv"))("sqlite://.data/database.sqlite", {
  namespace: "muted-roles"
});
const mutedMembers = new (require("keyv"))("sqlite://.data/database.sqlite", {
  namespace: "muted-members"
});
const moment = require("moment");
require("moment-duration-format");
const {
  noPermission,
  noBotPermission,
  findMember
} = require("../custom_modules/ncbutil.js");
const { RichEmbed, GuildMember } = require("discord.js");
const parse = require("parse-duration");
module.exports = {
  name: "mute",
  guildOnly: true,
  description: "mute a member",
  usage: "<member> [duration] [reason]",
  cooldown: 2,
  args: 1,
  info:
    "if [duration] is not provided,the member will be muted for five octononagintillion, four hundred and ninty-seven septennonagintillion ,nine hundred and eighty two sexnonagintillion ,eight hundred and eighty seven quinnonagintillion, eight hundred and twenty seven quattuornonagintillion ,six hundred and ninty seven trenonagintillion (5.478982887827697e+297) years",
  execute: async (message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return noPermission("Manage messages", message.channel);
    if (!message.guild.me.hasPermission("MANAGE_ROLES"))
      return noBotPermission("manage roles", message.channel);
    const muted = await mutedRoles.get(message.guild.id);
    if (!muted)
      return message.reply(
        "Muted role is not set. Use `config moderation muted-role <role>` to set it."
      );
    const mutedRole = message.guild.roles.get(muted);
    if (!mutedRole)
      return message.reply(
        "Corrupted muted role configuration.Use `config moderation muted-role <role>` to set it."
      );
    // if ((mutedRole.position - message.guild.me.highestRole.position) > 0) return noBotPermission("A role higher than the muted role")
    const member = await findMember(message, args[0])
      .catch(error => message.reply("Unknown member"))
      .then(async member => {
        if (!member.addRole) return;
        console.log(member.id);
        let data = await mutedMembers.get(message.guild.id);
        if (!data) data = {};
        let duration = parse(args[1] || "0");
        if (duration === 0) {
          member.addRole(mutedRole.id, args.slice(1).join(" "));
          duration = 1.729e308;
        } else member.addRole(mutedRole.id, args.slice(2).join(" "));
        data[member.id] = Date.now() + duration;
        mutedMembers.set(message.guild.id, data);
        const read = moment
          .duration(duration)
          .format(
            "Y [years], M [months], W [weeks], D [days], M [minutes], s [seconds], S [milliseconds]"
          );
        message.channel.send(`${member.user.tag} has been muted for ${read}`);
      });
  }
};
