/**
 * Server status endpoint used by facebook
 * @param {object} request object
 * @param {object} response object
 * @param {object} next callback
 * @return {response} json response || error
 */
const status = (req, res, next) => {
    if (req.url === '/_status') {
        return res.end(JSON.stringify({
            status: 'ok'
        }));
    }

    return next();
};

module.exports = {
    status
};
