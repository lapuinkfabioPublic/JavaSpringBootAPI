<?php

$baseUrl = getenv('SITE_URL') ?: 'https://localhost';

return [
    'messages' => [
        $baseUrl . '/evertec/carreras' => $baseUrl . '/evertec/en/carreras/',
        $baseUrl . '/evertec/inversores/' => $baseUrl . '/evertec/en/inversores/',
        $baseUrl . '/evertec/nuestra-gente' => $baseUrl . '/evertec/en/nuestra-gente/',
        $baseUrl . '/evertec/nuestro-planeta' => $baseUrl . '/evertec/en/nuestro-planeta/',
        $baseUrl . '/evertec/nuestros-principios' => $baseUrl . '/evertec/en/nuestros-principios/',
        'url-button-4acd182' => $baseUrl . '/evertec/en/inversores/',
        'url-container-7b0736d' => $baseUrl . '/evertec/en/nuestros-principios/',
        'url-container-8f3ee74' => $baseUrl . '/evertec/en/nuestro-planeta/',
        'url-container-c021f1b' => $baseUrl . '/evertec/en/carreras/',
        'url-container-e745f23' => $baseUrl . '/evertec/en/nuestra-gente/'
    ]
];
