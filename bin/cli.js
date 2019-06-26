#!/usr/bin/env node

/**
 * Scrap reddit command
 * Used in CLI mode.
 */

const chalk = require('chalk');
const getThreads = require('../src/get-threads');

async function perform(subreddits) {
	console.log(chalk.blueBright('Fetching threads from subreddits...\n'));

	// Fetch threads from provided subreddits
	const results = {};
	await Promise.all(subreddits.map(async subreddit => {
		results[subreddit] = await getThreads(subreddit);
	}));

	// Print results
	Object.keys(results).forEach(subreddit => {
		console.log(
			`${chalk.cyan(subreddit.toUpperCase())} (${chalk.greenBright(`${results[subreddit].length} threads`)})`
		);
		results[subreddit].forEach(thread => {
			console.log(`${chalk.yellowBright('Score')}      \t ${chalk.bold(thread.score)}`);
			console.log(`${chalk.yellowBright('Subreddit')}  \t ${thread.subreddit}`);
			console.log(`${chalk.yellowBright('Title')}      \t ${thread.title}`);
			console.log(`${chalk.yellowBright('Thread link')}\t ${chalk.cyan.bold(thread.link)}\n`);
		});
	});
}

// Execute
const args = process.argv.splice(2, process.argv.length - 1);
perform(args[0].split(';').filter(s => s.replace(/ /g, '') !== ''));
