<?php

include_once "ch3f/network.php";
include_once "ch3f/keyboards.php";

/* ---------------------- */

function makeFont($string) {
    $mapping = [
        'q' => 'ǫ', 'w' => 'ᴡ', 'e' => 'ᴇ', 'r' => 'ʀ',
        't' => 'ᴛ', 'y' => 'ʏ', 'u' => 'ᴜ', 'i' => 'ɪ',
        'o' => 'ᴏ', 'p' => 'ᴘ', 'a' => 'ᴀ', 's' => 's',
        'd' => 'ᴅ', 'f' => 'ғ', 'g' => 'ɢ', 'h' => 'ʜ',
        'j' => 'ᴊ', 'k' => 'ᴋ', 'l' => 'ʟ', 'z' => 'ᴢ',
        'x' => 'x', 'c' => 'ᴄ', 'v' => 'ᴠ', 'b' => 'ʙ',
        'n' => 'ɴ', 'm' => 'ᴍ'
    ];

    $result = '';
    $chars = str_split($string);
    foreach ($chars as $char) {
        $result .= isset($mapping[$char]) ? $mapping[$char] : $char;
    }

    return $result;
}


function handleChats(): never {
    $bot = new Ch3fPooler("YOUR TOKEN");
    $admins = [000, 111, 222];
    $get_session_markup = new InlineKeyboardMarkup();
    $get_session_markup->addKeyboard(
        new InlineKeyboardButton("ɢᴇᴛ ꜱᴇꜱꜱɪᴏɴ 🍃", null, "getSession"), new InlineKeyboardButton("ᴄʟᴏꜱᴇ 🌐", null, "closeIt")
    );

    $msg_ids = [];
    while (true){
        $updates = $bot->getUpdates();
        if ($updates['local_status'] === "OK" && isset($updates['response']['ok']) && $updates['response']['ok']) {
            if (isset($updates['response']['result'][0])) {
                $update = $updates['response']['result'][0];
                if (isset($update['message'])){
                    if (!in_array($update['message']['message_id'], $msg_ids)) {
                        array_push($msg_ids, $update['message']['message_id']);
                        if (in_array($update['message']['from']['id'], $msg_ids)){
                            if (strpos($update['message']['text'], '/start')){
                                $bot->sendMessage([
                                    "text" => makeFont("welcome to Admin Panel 🛰\n\n🔰 /start - start bot\n📁 /port <...userid> <...mode>\n🕹 /ban <...userid>\n🎛 /unban <...userid>\n👁 /see <...userid> - see profile"),
                                    "chat_id" => $update['message']['chat']['id'],
                                    "reply_to_message_id" => $update["message"]["id"]
                                ]);
                            }
                        }
                    }
                } else {
                    echo var_dump($update);
                }
            }
        }
    }
}

handleChats();