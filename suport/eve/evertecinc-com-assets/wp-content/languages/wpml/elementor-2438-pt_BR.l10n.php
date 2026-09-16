<?php

$baseUrl = getenv('SITE_URL') ?: 'https://localhost';

return [
    'messages' => [
        $baseUrl . '/evertec/carreras' => $baseUrl . '/evertec/pt-br/carreras/',
        $baseUrl . '/evertec/inversores/' => $baseUrl . '/evertec/pt-br/inversores/',
        $baseUrl . '/evertec/nuestra-gente' => $baseUrl . '/evertec/pt-br/nuestra-gente/',
        $baseUrl . '/evertec/nuestro-planeta' => $baseUrl . '/evertec/pt-br/nuestro-planeta/',
        $baseUrl . '/evertec/nuestros-principios' => $baseUrl . '/evertec/pt-br/nuestros-principios/',
        'url-button-4acd182' => $baseUrl . '/evertec/pt-br/inversores/',
        'url-container-7b0736d' => $baseUrl . '/evertec/pt-br/nuestros-principios/',
        'url-container-8f3ee74' => $baseUrl . '/evertec/pt-br/nuestro-planeta/',
        'url-container-c021f1b' => $baseUrl . '/evertec/pt-br/carreras/',
        'url-container-e745f23' => $baseUrl . '/evertec/pt-br/nuestra-gente/'
    ]
];
