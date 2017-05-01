/**
 * Get public view
 * @param {object} request object
 * @param {object} response object
 * @param {object} next callback
 * @return {response} render response
 */
const get = (req, res) => {
    res.render('public');
};

/**
 * Get private view
 * @param {object} request object
 * @param {object} response object
 * @param {object} next callback
 * @return {response} render response
 */
const getPrivate = (req, res) => {
    res.render('private');
};


/**
 * Get private view
 * @param {object} request object
 * @param {object} response object
 * @param {object} next callback
 * @return {response} render response
 */
const getChat = (req, res) => {
    res.render('chat');
};

module.exports = {
    get,
    getChat,
    getPrivate
};
