const io = require('socket.io');
const intentService = require('../services/intents/intent.service');
const configService = require('../services/config.service');

let ioServer;

/**
 * Connect websocket server and listen
 * @param {object} express server
 */
const init = (server) => {
    ioServer = io(server);

    ioServer.on('connection', (socket) => {
        socket.on('message', (body) => {
            const message = body.message;
            const sessionId = body.sessionId;

            intentService.getResponse(message, sessionId, socket.id, 'socket').then((result) => {
                if (result.action === 'input.unknown') {
                    result.answer.push(result.last_message);
                }

                const clone = JSON.parse(JSON.stringify(result));
                for (let i = 0; i < result.answer.length; i += 1) {
                    setTimeout((function outerloop(x, res) {
                        return function loop() {
                            const response = res;
                            response.answer = result.answer[x];
                            socket.emit('response', response);
                        };
                    }(i, clone)), 4000 * i);
                }
            });
        });

        socket.on('config', () => {
            configService.getConfig().then((result) => {
                socket.emit('config', result);
            });
        });
    });
};

module.exports = {
    init
};
