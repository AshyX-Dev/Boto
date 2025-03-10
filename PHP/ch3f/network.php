<?php

// getUpdates
// sendMessage
// sendDocument
// InlineKeyboard
// callbackQuery

class Ch3fPooler
{
    public $token;
    private $url;
    private $ch;
    public function __construct(string $token){
        $this->token = $token;
        $this->url = "https://api.telegram.org/bot" . $this->token . "/";
        $this->ch = curl_init();
        curl_setopt($this->ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($this->ch, CURLOPT_POST, true);
    }

    public function createConnection(string $method, array $options = []): array {
        curl_setopt($this->ch, CURLOPT_POSTFIELDS, http_build_query($options));
        curl_setopt($this->ch, CURLOPT_URL, $this->url.$method);
        try{
            $response = curl_exec($this->ch);
            return [
                "local_status" => "OK",
                "response" => json_decode($response, true)
            ];
        } catch (Exception $e) {
            return [
                "local_status" => "RESPONSE_ERROR",
                "response" => $response,
                "error_message" => $e->getMessage()
            ];
        }
    }

    public function getUpdates(): array {
        return $this->createConnection(
            "getUpdates", []
        );
    }

    public function sendMessage(array $fields): array {
        return $this->createConnection(
            "sendMessage", $fields
        );
    }

    public function sendDocument(array $fields): array {
        return $this->createConnection(
            "sendDocument", $fields
        );
    }

}