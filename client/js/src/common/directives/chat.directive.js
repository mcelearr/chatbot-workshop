/**
 * @name directives.chat
 **/

(function() {

    angular
        .module('common')
        .directive('chat', chatConfig)
        .controller('chat.directive.controller', chatController);

    /* @ngInject */
    function chatController($scope, $element, $timeout, apiService, ModalService, notificationService) {

      /*
      Events
       */

        $scope.message = '';
        $scope.messages = [];
        $scope.retrain = retrain;
        $scope.loading = false;
        $scope.processButton = processButton;
        $scope.sendMessage = sendMessage;

        var sessionId;
        var chat = document.getElementById("chat-history");
        var loader = document.getElementById("loader");
        var socket = io();

        $scope.bot = {
            name: 'Bot',
            id: 'bot',
            description: 'This is the bot framework',
            welcome: "Hi I'm botty,",
            active: true,
            message: []
        };

        /*
        Private functions
         */

        function apiServiceError(err) {
            notificationService.defaultError();
        }

        function processButton(button) {
            if (button.url) {
                window.open(button.url);
            }

            if (button.payload) {
                $scope.messages.push({
                  id: $scope.messages.length,
                  message: button.payload,
                  isSelf: true,
                  type: 'user'
                });

                sendMessage(button.payload);
            }
        }

        function sendReply(message) {
            document.getElementById('loader').style.display = 'block';

            $scope.loading = true;

            $timeout(function() {
                document.getElementById('loader').style.display = 'none';
                $scope.loading = false;

                var payload;

                if (message.answer.attachment && message.answer.attachment.payload) {
                    payload = message.answer.attachment.payload;
                }

                $scope.messages.push({
                    id: $scope.messages.length,
                    message: message.answer.text,
                    isSelf: false,
                    result: message,
                    type: message.type,
                    payload: payload
                });

                $scope.finished();

            }, 10);
        }

        function setEmotions(result) {
            var highest = 0,
                tone = 'joy';

            result.answer.tone = 'joy';

            if (result.answer.emotions) {
                for (var property in result.answer.emotions.emotions) {
                    if (result.answer.emotions.emotions[property] > highest) {
                        highest = result.answer.emotions.emotions[property];
                        tone = property;
                    }
                }

                result.answer.tone = tone;
            }

            return result;
        }

        function setMessageText(result) {


            if (result.answer.speech) {
                result.answer.text = result.answer.speech;
            }

            if (result.answer.emotions && result.answer.emotions.speech) {
                result.answer.text = result.answer.emotions.speech;
            }

            if (result.answer.attachment) {
                result.type = result.answer.attachment.type;

                if (result.type === 'image') {
                    result.answer.text = result.answer.attachment.payload.url;
                }

                if (result.type === 'template') {
                    result.type = result.answer.attachment.payload.template_type;

                    if (result.type === 'generic') {
                        result.answer.text = result.answer.attachment.payload.elements;
                    }

                    if (result.type === 'button') {
                        result.type = 'message-button';
                        result.answer.text = result.answer.attachment.payload.text;
                        result.buttons = result.answer.attachment.payload.buttons;
                    }
                }
            }


            if (result.answer.quick_replies) {
                result.buttons = result.answer.quick_replies;
                result.type = 'message-button';
            }

            return result;
        }


        function setSessionId(result) {
            if (result.question && result.question.sessionId) {
                sessionId = result.question.sessionId;
            } else if (result.session_id) {
                sessionId = result.session_id;
            }

            return result;
        }

        function processResponse(result) {
            result = setMessageText(result);
            result = setSessionId(result);

            if (result.answer.emotions) {
                result = setEmotions(result);
            }

            sendReply(result);
        }

        function sendMessage(message) {
            var isAuto = true;

            if ($scope.message.length > 0 || message) {

                if (!message) {
                    isAuto = false;
                    message = $scope.message;
                }

                $scope.message = '';

                if (!isAuto) {
                    $scope.messages.push({
                        id: $scope.messages.length,
                        message: message,
                        isSelf: true,
                        type: 'user'
                    });
                }

                $scope.finished();

                socket.emit('message', {
                    message: message,
                    sessionId: sessionId
                });
            }

        }

        // Remove job from queue and from the front-end list.
        function retrain(row) {
            ModalService.showModal({
                templateUrl: "/partials/private/directives/models/retrain.html",
                controller: "directives.modals.retrain.controller",
                inputs: {
                    item: row
                }
            }).then(function(modal) {
                modal.close.then(function(result) {});
            });
        }

        $scope.finished = function() {
            $timeout(function() {
                chat.scrollTop = chat.scrollHeight - chat.clientHeight;
            });
        };

        /*
        Events
         */

        socket.on('response', function(result) {
            if (result) {
                result.type = 'text';

                if (result.answer && typeof result.answer == 'string') {
                    result.answer = JSON.parse(result.answer);
                }

                if (result.response && typeof result.response == 'string') {
                    result.response = JSON.parse(result.response);
                }

                processResponse(result);
            }

        });

        document.getElementById('message-to-send').onkeypress = function(event) {
            if (event.which === 13) {
                event.preventDefault();
                $scope.sendMessage();
                $scope.$apply();
            }
        };

        sendReply({
            answer: {
                text: $scope.bot.welcome
            },
            type: 'text'
        });

    }

    function chatConfig() {
        return {
            restrict: 'E',
            templateUrl: '/partials/private/directives/chat.html',
            controller: 'chat.directive.controller',
        };
    }

}());
