import "./setup";

import { Client, PresenceData } from "discord.js";
import { setActive } from "./db";

import * as announceModule from './modules/announce';

// Enable console.debug logs
console.logLevel = process.env.DEPLOY_ENVIRONMENT === "development" ? 4 : 3;

const app = new Client();

// Setting up modules
announceModule.setup(app);

app.on('ready', async () => {

  //Start announce-bot as inactive
  setActive(false, "announceArrival");

  //Set presence message
  const presence: PresenceData = {
    afk: true,
    activity: {
      name: 'commands',
      type: 'LISTENING',
    },
    status: 'dnd',
  };

  if (app.user != null) {
    app.user.setPresence(presence)
      .catch(console.warn);
  }

  console.info(`Client ready`);
})

app.on('rateLimit', (data) => {
  console.warn(`Rate limiting in effect`, data);
});

app
  .login(process.env.DISCORD_TOKEN)
  .then(() => console.info("Login successful!"))
  .catch((err) => console.error("Login failed:", err));
