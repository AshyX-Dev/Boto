<?php

include_once "network.php";
include_once "keyboards.php";

$token = "";
$chid = "";

$bot = new Ch3fPooler($token);
$markup = new InlineKeyboardMarkup();
$markup->addKeyboard(
    new InlineKeyboardButton("Hiiiiiii", null, "hi_callbacked")
);

$data = $bot->getUpdates();
echo "\n" . var_dump($data) . "\n";
$sdata = $bot->sendMessageInline(
    [
        "chat_id" => $chid,
        "text" => "Hello world",
    ],
    $markup->keybuttons
);

echo "\n" . var_dump($sdata) . "\n";