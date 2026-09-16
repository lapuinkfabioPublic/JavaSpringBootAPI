<?php

$baseUrl = getenv('SITE_URL') ?: 'https://localhost';

return [
    'messages' => [
        $baseUrl . '/evertec/carreras/' => $baseUrl . '/evertec/pt-br/carreiras/',
        $baseUrl . '/evertec/nuestra-gente' => $baseUrl . '/evertec/pt-br/nossa-gente/',
        $baseUrl . '/evertec/nuestro-planeta' => $baseUrl . '/evertec/pt-br/nosso-planeta/',
        $baseUrl . '/evertec/nuestros-principios' => $baseUrl . '/evertec/pt-br/nossos-principios/',
        'url-container-53f3f64' => $baseUrl . '/evertec/pt-br/nosso-planeta/',
        'url-container-d246b41' => $baseUrl . '/evertec/pt-br/carreiras/',
        'url-container-db72d27' => $baseUrl . '/evertec/pt-br/nossa-gente/',
        'url-container-fca6f04' => $baseUrl . '/evertec/pt-br/nossos-principios/'
    ]
];
