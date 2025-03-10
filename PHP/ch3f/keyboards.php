<?php

class InlineKeyboardButton {
    public $text;
    public $type;
    public $depends;

    public function __construct(string $text, string $url = null, string $callback_data = null) {
        $this->text = $text;

        if ($url !== null && $callback_data !== null) {
            throw new InvalidArgumentException("Cannot use both `url` and `callback_data`");
        }

        if ($url === null && $callback_data === null) {
            throw new InvalidArgumentException("Must use either `url` or `callback_data`");
        }

        $this->type = $url !== null ? "url" : "callback_data";
        $this->depends = $url !== null ? $url : $callback_data;
    }
}

class InlineKeyboardMarkup {
    public $keybuttons = [];

    public function addKeyboard(InlineKeyboardButton ...$buttons) {
        $this->keybuttons[] = [];

        foreach ($buttons as $button) {
            if (!($button instanceof InlineKeyboardButton)) {
                throw new InvalidArgumentException("Invalid Keyboard type");
            }

            $this->keybuttons[count($this->keybuttons) - 1][] = [
                "text" => $button->text,
                $button->type => $button->depends
            ];
        }

        return $this->keybuttons;
    }

}
