// tslint:disable-next-line: no-namespace
declare namespace NodeJS {
  export interface ProcessEnv {
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

    FIREBASE_CONFIG: string;

    DATABASE_VERSION: string;

    DATABASE_URL: string;
  }
}
