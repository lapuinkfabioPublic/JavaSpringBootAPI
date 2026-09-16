<?php

$baseUrl = getenv('SITE_URL') ?: 'https://localhost';

return [
    'messages' => [
        $baseUrl . '/evertec/contacto' => $baseUrl . '/evertec/en/contact/',
        $baseUrl . '/evertec/donde-estamos' => $baseUrl . '/evertec/en/where-we-are/',
        'url-button-281641d' => $baseUrl . '/evertec/en/contact/',
        'url-container-426dd04' => $baseUrl . '/evertec/en/where-we-are/'
    ]
];
