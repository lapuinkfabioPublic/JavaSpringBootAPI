<?php

$baseUrl = getenv('SITE_URL') ?: 'https://localhost';

return [
    'messages' => [
        $baseUrl . '/evertec/contacto' => $baseUrl . '/evertec/pt-br/contato/',
        $baseUrl . '/evertec/donde-estamos' => $baseUrl . '/evertec/pt-br/onde-estamos/',
        'url-button-281641d' => $baseUrl . '/evertec/pt-br/contato/',
        'url-container-426dd04' => $baseUrl . '/evertec/pt-br/onde-estamos/'
    ]
];
