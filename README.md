# chatbot-workshop

This is the bare bones version of Filament's Bot Framework for making chatbots with api.ai and facebook messenger.

## Quickstart

Use node version 6+ (I used 6.10.2)

```bash
git clone https://github.com/mcelearr/chatbot-workshop.git & cd chatbot-workshop
```
Create an SQL database and put the connection details into a config.env file in root of project.

Here are the fields you will need in your config.env

```bash
DB_CLIENT=postgres
DB_PORT=5432
DB_HOST=localhost
DB_USER=yourrootname
DB_PASSWORD=yourrootpassword
DB_DATABASE=somedatabasename
API_AI_CLIENT=
API_AI_DEVELOPER=
FACEBOOK_TOKEN=
FACEBOOK_VERIFY=
FACEBOOK_SECRET=
```

If you are using the postgres CLI you can create a database with `createdb somedatabasename`

```bash
npm install
npm run database-build
npm run gulp-build
npm run gulp-watch
npm run dev
```
Now go to http://localhost:4000/ in your browser.
