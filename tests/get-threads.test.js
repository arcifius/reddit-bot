const {assert, expect} = require('chai');
const nock = require('nock');
const getThreads = require('../src/get-threads');
const requests = require('./fixtures/requests');

describe('Reddit getThreads', () => {
	describe('For valid threads', () => {
		before(() => {
			nock('https://www.reddit.com')
				.get('/r/cats/top.json')
				.once()
				.query({after: /^.*$/g, t: /^.*$/g, limit: /^.*$/g})
				.reply(200, requests.firstPage);

			nock('https://www.reddit.com')
				.get('/r/cats/top.json')
				.once()
				.query({after: /^.*$/g, t: /^.*$/g, limit: /^.*$/g})
				.reply(200, requests.secondPage);
		});

		it('fetches top ones from subreddit and format them', async () => {
			const expectedKeys = ['score', 'subreddit', 'title', 'link'];
			const threads = await getThreads('cats', 5000, 'day', 2);

			assert(threads.length === 2);
			threads.forEach(thread => {
				expect(thread).to.have.all.keys(expectedKeys);
			});
		});
	});

	describe('For invalid threads', () => {
		before(() => {
			nock('https://www.reddit.com')
				.get('/r/bb/top.json')
				.once()
				.query({after: /^.*$/g, t: /^.*$/g, limit: /^.*$/g})
				.reply(200, requests.notFound);

			nock('https://www.reddit.com')
				.get('/r/aaaa/top.json')
				.once()
				.query({after: /^.*$/g, t: /^.*$/g, limit: /^.*$/g})
				.reply(200, requests.private);
		});

		it('ignores non existing ones', async () => {
			const threads = await getThreads('bb');
			expect(threads).to.have.lengthOf(0);
		});

		it('ignores private ones', async () => {
			const threads = await getThreads('aaaa');
			expect(threads).to.have.lengthOf(0);
		});
	});
});
