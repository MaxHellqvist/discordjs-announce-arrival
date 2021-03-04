import { betterLogging, Theme } from "better-logging";
import { config } from "dotenv";
import { Client } from "discord.js";
import { deleteMessageIfAble } from "./helpers/msgDelete";

// Config env variables
config();

// Setup logging
betterLogging(console, {
  color: Theme.dark,
});

// Enable console.debug logs
console.logLevel = process.env.DEPLOY_ENVIRONMENT === "development" ? 4 : 3;

const app = new Client();

app.on("message", (msg) => {
  if (msg.author.bot) return;
  if (msg.content.startsWith("!ping")) {
    console.info(`[in][${msg.author.username}] ${msg.content}`);
    msg.channel.send("Pong!");
    console.info(`[out][${msg.guild?.me?.user.username}] ${msg.content}`);
    deleteMessageIfAble(msg);
  }
});

app
  .login(process.env.DISCORD_TOKEN)
  .then(() => console.info("Login successful!"))
  .catch((err) => console.error("Login failed:", err));
