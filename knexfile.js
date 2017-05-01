// Update with your config settings.
require('env2')('./config.env');

module.exports = {

    development: {
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

    staging: {
        client: process.env.DB_CLIENT || 'mysql',
        connection: {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            database: 'chatbotdemo',
            port: process.env.DB_PORT || 3306,
            charset: 'utf8mb4'
        }
    },

    production: {
        client: process.env.DB_CLIENT || 'mysql',
        connection: {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            database: 'chatbotdemo',
            port: process.env.DB_PORT || 3306,
            charset: 'utf8mb4'
        }
    }

};
