const axios = require('axios');

function _extractInfo(jsonData) {
	// If subreddit isnt found, igore suggestions
	if ((jsonData.data.children[0] && jsonData.data.children[0].kind === 't5') || jsonData.error) {
		return [];
	}

	return jsonData.data.children.map(thread => ({
		score: thread.data.score,
		subreddit: thread.data.subreddit,
		title: thread.data.title,
		link: `https://www.reddit.com${thread.data.permalink}`
	}));
}

async function getThreads(subreddit, minScore = 5000, period = 'day', pageSize = 25) {
	const url = `https://www.reddit.com/r/${subreddit}/top.json`;
	let results = [];
	let stopFetching = false;
	let graceRequests = 1;
	let next = '';

	do {
		try {
			// eslint-disable-next-line no-await-in-loop
			const response = await axios.get(`${url}`, {
				params: {
					after: next,
					t: period,
					limit: pageSize
				}
			});

			// If thread exists without nothing we should stop
			if (response.data.data.children.length === 0) {
				stopFetching = true;
				graceRequests = 0;
			} else {
				// Extract info
				const threads = _extractInfo(response.data);
				next = response.data.data.after;

				// Add relevant threads only
				results = results.concat(
					threads.filter(thread => thread.score >= minScore)
				);

				// Decide if more requests should be performed
				if (stopFetching) {
					graceRequests -= 1;
				} else if (threads.some(thread => thread.score < minScore)) {
					stopFetching = true;
				}
			}
		} catch (error) {
			// We will not retry nor handle failures...
			stopFetching = true;
			graceRequests = 0;
		}
	} while (!stopFetching || graceRequests > 0);

	// Sort by score since reddit sometimes fails on it
	results.sort((a, b) => b.score - a.score);

	return results;
}

module.exports = getThreads;
