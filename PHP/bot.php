<?php

include_once "conf.php";
include_once "ch3f/network.php";
include_once "ch3f/keyboards.php";

/* ---------------------- */


function handleChats(): never {
    global $token;
    $bot = new Ch3fPooler($token);
    $get_session_markup = new InlineKeyboardMarkup();
    $get_session_markup->addKeyboard(
        new InlineKeyboardButton("ɢᴇᴛ ꜱᴇꜱꜱɪᴏɴ 🍃", null, "getSession"), new InlineKeyboardButton("ᴄʟᴏꜱᴇ 🌐", null, "closeIt")
    );

    $msg_ids = [];
    while (true){
        $updates = $bot->getUpdates();
        if ($updates['local_status'] === "OK"){
            if ($updates['response']['ok']){
                $update = $updates['response']['result'][0];
                if (!(in_array($update['message_id'], $msg_ids))){
                    echo var_dump($update);
                }
            }
        }
    }
}

handleChats();