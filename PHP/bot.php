<?php

include_once "ch3f/network.php";
include_once "ch3f/keyboards.php";

/* ---------------------- */

function handleChats(): never {
    $bot = new Ch3fPooler("YOUR TOKEN");
    $admins = ['', '', ''];
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
                if (!in_array($update['message']['message_id'], $msg_ids)) {
                    array_push($msg_ids, $update['message']['message_id']);
                    echo var_dump($update);
                }
            }
        }
    }
}

handleChats();