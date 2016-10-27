**Installing**

_1) Download composer:_

<pre>
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('SHA384', 'composer-setup.php') === 'e115a8dc7871f15d853148a7fbac7da27d6c0030b848d9b3dc09e2a0388afed865e6a3d6b3c0fad45c48e2b5fc1196ae') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php
php -r "unlink('composer-setup.php');"
</pre>

_2) Install:_

<pre>
php composer.phar require programmis/socket-chat
</pre>

**Starting chat server**

<pre>
$loader = require __DIR__ . '/vendor/autoload.php';
$loader->add('php', __DIR__);

$server = new php\Server();
$server->start();
</pre>

**Client side**

```html
<script src="js/socketChat.js"></script>
```

_Init java constants_
```html
<script type="application/javascript">
    $(function () {
        <?= Server::fillJavaConstants(); ?>
    });
</script>
```

_Settings_
<pre>
socketChat.message_area_id = "You're textarea id for messages";
socketChat.socket_url = "You're server address : and port";
socketChat.room = "Chat room name";
socketChat.hash = "You're secret hash for processing with UserProcessor";
socketChat.user_typing_timeout = "For auto disable user typing status";
socketChat.message_history_period = "For default request message history";
</pre>

_Functions_
<pre>
socketChat.open(); - open connect with server
socketChat.close(); - close connect with server
socketChat.send(user_id); - send message to user, if user_id is undefined then send message to all users in current room 
socketChat.getUserList(); - get all users in current room
socketChat.getMessageHistory(with_user_id, period); - get all messages for current user and with_user_id by period
</pre>

_Events_
<pre>
socketChat.onConnect - called if chat connected to server
socketChat.onDisconnect - call if chat disconnected with server
socketChat.onMessageRender - called if render message with "message" in parameter 
socketChat.onMessageListRender - called if render message list with "message_list" in parameter
socketChat.onUserRender - called if user render with "user" in parameter
socketChat.onUserListRender - called if user list render with "user_list" in parameter
socketChat.onUserTypingStart - called if user start typing with "user_id" in parameter
socketChat.onUserTypingEnd - called if user end typing with "user_id" in parameter
</pre>

**For example see index.php and socketChatDemo.js files**

_Sorry for my english_