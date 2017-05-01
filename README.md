# chatbot-workshop

## Quickstart

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
