# reddit-scraper

This project allows you to specify subreddits and then retrieve the most upvoted threads. It also includes a telegram bot so you can request the scrap through the app :D

## Usage

You can use this project in three ways

-   as a npm package, you will be able to use `getThreads` function.
-   as CLI command. Use `scrap-cli cats;brasil`.
-   as a Telegram bot, start it with `scrap-bot`.

**CLI setup**

1. Clone the repo.
2. Move to project's folder through a terminal.
3. Run `npm install`.
4. Run `npm link` to allow commands.
5. Run `scrap-cli "askreddit;worlwide;cats"`.
6. You did it \o/

**Telegram bot setup**

1. Clone the repo.
2. Create a `.env` file into project's folder.
3. Put your bot token into `.env` file.
    - Eg.: `BOT_TOKEN=YOUR_BOT_TOKEN`
4. Move to project's folder through a terminal.
5. Run `npm install`.
6. Run `npm link` to allow commands.
7. Run `scrap-bot` to start the bot.
8. Now your bot should be running, go to telegram app and search for your bot.
9. Start a conversation with it and type `/nadaprafazer askreddit;cats;worldwide`
10. Enjoy the results (:

Get your bot token: https://core.telegram.org/bots

**NPM package**
This project isn't registered on NPM registry so to try out `getThreads` function you must use node console.

On a terminal, run

```bash
node
```

then

```node
const getThreads = require("./index");
```

`getThreads` function accepts four params:

-   subreddit: `String`.
-   minScore: `Number` defaults to `5000`.
-   period: `String` defaults to `"day"`.
-   pageSize: `Number` defaults to `25`.

## Tests

You can run tests with `npm test`.

## Linting

You can lint the project with `npm run lint` and `npm run lint-fix` will fix most common mistakes while highlighting the ones that couldn't be fixed.

## Structure

-   `/bin/`
    -   cli.js
        -   Implementation of reddit scraper CLI command.
    -   bot.js
        -   Implementation of reddit scraper telegram bot.
-   `/src/`
    -   get-threads.js
        -   Implementation of reddit scraper function.
-   `/tests/`
    -   fixtures folder and tests.
-   `index.js`
    -   Exports getThreads function.
