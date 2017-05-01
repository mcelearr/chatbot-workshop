const knex = require('knex');
const bookshelf = require('bookshelf');
const config = require('./env');

const Bookshelf = bookshelf(knex(config.db));

module.exports = Bookshelf;
