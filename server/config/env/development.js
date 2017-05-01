require('env2')('./config.env');

module.exports = {
    env: 'development',
    emotions: true,
    db: {
        client: process.env.DB_CLIENT,
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,
            charset: 'utf8mb4'
        }
    },
    apiai: {
        client: process.env.API_AI_CLIENT,
        developer: process.env.API_AI_DEVELOPER
    },
    facebook: {
        token: process.env.FACEBOOK_TOKEN,
        verify: process.env.FACEBOOK_VERIFY,
        app_secret: process.env.FACEBOOK_SECRET
    },
    port: process.env.PORT || 4000
};
