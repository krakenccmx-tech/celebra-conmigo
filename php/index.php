<?php

declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/storage/logs/app.log');

require_once __DIR__ . '/config/app.php';
require_once __DIR__ . '/core/helpers.php';

spl_autoload_register(function (string $class): void {
    $paths = [
        __DIR__ . '/core/' . $class . '.php',
        __DIR__ . '/controllers/' . $class . '.php',
        __DIR__ . '/models/' . $class . '.php',
    ];
    foreach ($paths as $path) {
        if (file_exists($path)) {
            require_once $path;
            return;
        }
    }
});

Session::start();

$routes = require __DIR__ . '/config/routes.php';
$router = new Router($routes);
$router->dispatch();
