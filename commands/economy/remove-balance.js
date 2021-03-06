// Copyright 2018 Jonah Snider

const { Command } = require('discord.js-commando');
const config = require('../../config');
const diceAPI = require('../../providers/diceAPI');
const { respond } = require('../../providers/simpleCommandResponse');

module.exports = class RemoveBalanceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'remove-balance',
			group: 'economy',
			memberName: 'remove-balance',
			description: 'Remove oats from another user\'s account.',
			details: 'Only the bot owner(s) may use this command.',
			aliases: ['remove-bal', 'decrease-balance', 'decrease-bal', 'lower-bal', 'reduce-bal'],
			examples: ['remove-balance 500 @Dice'],
			args: [{
				key: 'amount',
				prompt: 'How many oats do you want to remove?',
				type: 'float',
				parse: amount => diceAPI.simpleFormat(amount),
				min: config.minWager
			},
			{
				key: 'user',
				prompt: 'Who do you want to remove oats from?',
				type: 'user'
			}
			],
			throttling: {
				usages: 2,
				duration: 30
			},
			ownerOnly: true
		});
	}

	async run(msg, { user, amount }) {
		// Permission checking
		if(user.bot === true && user.id !== this.client.user.id) {
			return msg.reply('❌ You can\'t remove oats from bots.');
		}

		// Remove oats from user
		await diceAPI.decreaseBalance(user.id, amount);

		// Respond to author with success
		respond(msg);

		return null;
	}
};
