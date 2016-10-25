/**
 * Created by daniil on 21.10.16.
 */

var socketChat = {
    is_connect: false,
    socket: null,
    socket_url: '127.0.0.1:1337',
    room: '',
    hash: '',

    user_typing_info_class: '',
    user_typing_timeout: 3000,
    message_area_id: '',
    dialog_container_id: '',
    users_container_id: '',

    MESSAGE_TYPE_TEXT: '',
    MESSAGE_TYPE_EVENT: '',
    MESSAGE_TYPE_SYSTEM: '',
    MESSAGE_CONTAINER: '',
    DEFAULT_ROOM: '',
    EVENT_TYPING: '',
    SYSTEM_COMMAND_GET_USER_LIST: '',
    SYSTEM_TYPE_USER_LIST: '',
    SYSTEM_TYPE_USER_CONNECTED: '',

    eventUserTypingTimers: [],

    open: function () {
        if (socketChat.is_connect) {
            console.log("Is connected");
            return false;
        }
        var room = socketChat.room ? socketChat.room : socketChat.DEFAULT_ROOM;

        socketChat.socket = new WebSocket(
            "ws://" + socketChat.socket_url + '/'
            + room + '/' + socketChat.hash
        );

        socketChat.socket.onopen = function () {
            socketChat.is_connect = true;
            socketChat.sendSystem(socketChat.SYSTEM_COMMAND_GET_USER_LIST);
            console.log("Сonnected");
        };

        socketChat.socket.onclose = function (event) {
            var msg = 'Closed';
            socketChat.is_connect = false;

            if (event.wasClean) {
                msg += ' clean';
            } else {
                msg += ' broken';
            }
            console.log(msg);
        };

        socketChat.socket.onmessage = function (event) {
            var data = JSON.parse(event.data);
            switch (data.type) {
                case socketChat.MESSAGE_TYPE_TEXT:
                    socketChat.messageProcessing(data[socketChat.MESSAGE_CONTAINER]);
                    break;
                case socketChat.MESSAGE_TYPE_EVENT:
                    socketChat.eventProcessing(data[socketChat.MESSAGE_CONTAINER]);
                    break;
                case socketChat.MESSAGE_TYPE_SYSTEM:
                    socketChat.systemProcessing(data[socketChat.MESSAGE_CONTAINER])
                    break;
            }
        };

        $('body')
            .off('keyup', '#' + socketChat.message_area_id)
            .on('keyup', '#' + socketChat.message_area_id, function (event) {
                socketChat.sendEvent(
                    socketChat.EVENT_TYPING,
                    {
                        symbol: event.keyCode
                    }
                );
            });
    },
    addUser: function (user) {
        $('#' + socketChat.users_container_id).append(
            "<option value='" + user.id + "'>" + user.id + "</option>"
        );
    },
    systemProcessing: function (system) {
        switch (system.system) {
            case socketChat.SYSTEM_TYPE_USER_CONNECTED:
                socketChat.addUser(system.user);
                break;
            case socketChat.SYSTEM_TYPE_USER_LIST:
                break;
        }
    },
    messageProcessing: function (message) {
        socketChat.messageRender(message);
        socketChat.eventUserTypingEnd(message.user.id);
    },
    messageRender: function (message) {
        $('#' + socketChat.dialog_container_id).prepend(
            message.text + '<br>'
        );
    },
    eventProcessing: function (event) {
        switch (event.event) {
            case socketChat.EVENT_TYPING:
                socketChat.eventTypingProcessing(event);
                break;
        }
    },
    eventTypingProcessing: function (event) {
        if (socketChat.eventUserTypingTimers[event.user.id]) {
            clearTimeout(socketChat.eventUserTypingTimers[event.user.id]);
        }
        socketChat.eventUserTypingTimers[event.user.id] = setTimeout(function () {
            socketChat.eventUserTypingEnd(event.user.id);
        }, socketChat.user_typing_timeout);
        socketChat.eventUserTypingStart(event.user.id);
    },
    eventUserTypingStart: function (user_id) {
        $('.' + socketChat.user_typing_info_class + '[id="' + user_id + '"]').html('typing...');
    },
    eventUserTypingEnd: function (user_id) {
        $('.' + socketChat.user_typing_info_class + '[id="' + user_id + '"]').html('');
    },
    close: function () {
        socketChat.socket.close();
        socketChat.is_connect = false;
        console.log('Closing');
    },
    send: function () {
        var msgArea = $('#' + socketChat.message_area_id);
        var message = msgArea.val();
        msgArea.val('');
        if (!message.trim().length) {
            return false;
        }
        socketChat.sendMessage(message);
        return false;
    },
    prepareMessage: function (type, message) {
        var msg_arr = {
            type: type
        };
        msg_arr[socketChat.MESSAGE_CONTAINER] = message;

        return JSON.stringify(msg_arr);
    },
    sendMessage: function (message) {
        socketChat.socket.send(
            socketChat.prepareMessage(socketChat.MESSAGE_TYPE_TEXT, message)
        );
    },
    sendSystem: function (system, data) {
        var system_data = {
            system: system,
            data: data
        };
        socketChat.socket.send(
            socketChat.prepareMessage(socketChat.MESSAGE_TYPE_SYSTEM, system_data)
        );
    },
    sendEvent: function (event, data) {
        var event_data = {
            event: event,
            data: data
        };
        socketChat.socket.send(
            socketChat.prepareMessage(socketChat.MESSAGE_TYPE_EVENT, event_data)
        );
    }
};