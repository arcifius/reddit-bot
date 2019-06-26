#!/usr/bin/env node

require('dotenv').config();
const Telegraf = require('telegraf');
const chalk = require('chalk');
const getThreads = require('../src/get-threads');

async function _showList(ctx) {
	// Format input
	let subreddits = ctx.message.text.replace(/\/nadaprafazer */i, '');

	if (subreddits.replace(/ /g, '') === '') {
		ctx.replyWithMarkdown(
			'Por favor informe pelo menos um subreddit, digite `/help` caso precise de ajuda!'
		);
		return;
	}

	subreddits = subreddits.split(';').filter(s => s.replace(/ /g, '') !== '');

	// Fetch threads from subreddits
	const results = {};
	await Promise.all(subreddits.map(async subreddit => {
		results[subreddit] = await getThreads(subreddit);
	}));

	// Reply with results
	const response = [];
	Object.keys(results).forEach(subreddit => {
		response.push(`_${subreddit.toUpperCase()} (${results[subreddit].length} threads)_`);
		results[subreddit].forEach(thread => {
			response.push(`*Score*\n${thread.score}`);
			response.push(`*Subreddit*\n${thread.subreddit}`);
			response.push(`*Title*\n${thread.title}`);
			response.push(`*Link*\n[${thread.link}](${thread.link})\n`);
		});
		if (results[subreddit].length === 0) {
			response.push('\n');
		}
	});

	// Reply to user
	ctx.replyWithMarkdown(response.join('\n'));
}

if (!process.env.BOT_TOKEN) {
	console.log(chalk.redBright('Set BOT_TOKEN into your env'));
	process.exit(0);
}

console.log(chalk.blueBright('Initializing RedditScrapBot...'));

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start(ctx => ctx.reply('Olá! Sem nada pra fazer?'));
bot.help(ctx => ctx.replyWithMarkdown('Você pode me enviar `/nadaprafazer brasil;cats`, escolha seus subreddits e tente!'));
bot.command('nadaprafazer', _showList);
bot.launch()
	.then(() => console.log(chalk.greenBright('RedditScrapBot is ready!')))
	.catch(() => console.log(chalk.redBright('Bot startup failed: check your bot token')));

