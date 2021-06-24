# Sync
Student contact management system using Discord's OAuth system, MongoDB, and Express.

## Requirements
* Node.js (v16.3.0)
* MongoDB (v4.2.3)
* Discord application

In order to make a new Discord application, ensure you have created a Discord account [here](https://discord.com), then do the following steps.

* Navigate to the [Applications](https://discord.com/developers/applications). page in the developer portal.
* Click "New Application" at the top right.
* Enter a new name for your application.
* Navigate to the "Oauth2" tab on the left.
* Make a note of your Client ID and Client Secret, these will be used for login.
* Under the "Redirects" tab, add a URL with the following format: `https://{your url here}/auth/callback`, replacing "your URL here" with the URL you plan to use for the server.

## Getting Started
```bash
git clone git@github.com/ramadan8/Sync.git
cd Sync
npm i
```

Create a `.env` file and place the following values inside it.

```
SECRET_KEY = "a secure value to sign cookies with"
DISCORD_APP_ID = "your discord app ID"
DISCORD_APP_SECRET = "your discord app secret"
DISCORD_CALLBACK = "your discord callback URL"
```

To start running the server, simply type `npm start`. If you wish to run the app in production, make sure to set the `NODE_ENV` environment variable to `production`.