// Copyright 2018 Jonah Snider

const { Command } = require('discord.js-commando');
const { Util } = require('discord.js');

module.exports = class ListSelfRolesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'list-self-roles',
			aliases: ['self-role-list', 'self-roles-list', 'list-self-role', 'self-roles'],
			group: 'selfroles',
			memberName: 'list-self-roles',
			description: 'List all self-assigned roles from this server.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 4
			}
		});
	}

	async run(msg) {
		try {
			msg.channel.startTyping();

			// Get all of this guild's selfroles
			const selfRoles = await this.client.provider.get(msg.guild, 'selfRoles', []);

			// If the selfroles array is empty
			if(selfRoles.length === 0) {
				return msg.reply('❌ No selfroles');
			}

			// List of role names
			const roleList = [];

			// Iterate through each role on the guild
			for(const [id, guild] of msg.guild.roles.entries()) {
				if(!msg.guild.roles.has(id)) {
					// Find the position of the non-existent role and delete it from the array
					selfRoles.splice(selfRoles.indexOf(id));
					// Set the array to our updated version
					this.client.provider.set(msg.guild, 'selfRoles', selfRoles);
				} else if(selfRoles.includes(id) && msg.member.roles.has(id)) {
					// The role is a selfrole and the author has it
					roleList.push(`${guild.name} ▫`);
				} else if(selfRoles.includes(id)) {
					// The role is a selfrole
					roleList.push(guild.name);
				}
			}

			return msg.reply(`A ▫ indicates a role you currently have\n${Util.escapeMarkdown(roleList.join('\n'))}`);
		} finally {
			msg.channel.stopTyping();
		}
	}
};
