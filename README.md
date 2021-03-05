# discordjs-heroku-template

1. Setup Discordjs
   1. Create a Discord Account
   2. Create a Discord Application
      1. <https://discord.com/developers/applications>
   3. Setup Environment Variables
      1. Create a `.env` file from `.env.template`
      2. Fill in your DISCORD_TOKEN (can be found in the discord developer portal)
   4. Invite bot
2. Setup Heroku
   1. Create Heroku account
   2. Connect your github account to your heroku account
   3. Create a new Heroku App
   4. Select "Github" as the deployment method
   5. Connect your Heroku App to your Github repo
   6. Enable Automatic Deploys
   7. Setup Environment Variables
      1. Go to the Settings tab
      2. Click "reveal config vars"
      3. Add DISCORD_TOKEN from `.env`
      4. Add DEPLOY_ENVIRONMENT with the value `"production"`
   8. Setup worker dyno
      1. Go to the Resources tab
      2. Enable "worker" dyno
      3. Disable "web" dyno
3. Commit your code and any changes to github
4. Your bot is now live

Note: It is recommended to have 2 different Discord Applications, one for Production and one for Development.
That way you can develop your bot further without needing to take down the production bot while you develop.

## Env

```ts
/**
 * The secret token provided by discord for accessing the bot api.
 * @see https://discord.com/developers/applications
 */
DISCORD_TOKEN: string;

/**
 * The deployment environment is either "development" or "production".
 * This can be used to control log levels, debug features, as well as the database instance that will be used.
 */
DEPLOY_ENVIRONMENT: "development" | "production";
```

## Invite bot

`https://discord.com/oauth2/authorize?client_id=<YOUR_CLIENT_ID>&scope=bot`
