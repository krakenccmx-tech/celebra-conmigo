<?php

declare(strict_types=1);

/**
 * Celebra Conmigo - Database Configuration
 *
 * Fill in the credentials from your Hostinger panel:
 * Databases > MySQL Databases > your database details
 */

return [
    // Database host (from Hostinger: MySQL hostname)
    'host' => 'localhost',

    // Database port (default MySQL port)
    'port' => 3306,

    // Database name (from Hostinger: MySQL database name)
    'database' => 'celebra_conmigo',

    // Database username (from Hostinger: MySQL username)
    'username' => 'root',

    // Database password (from Hostinger: MySQL password)
    'password' => '',

    // Character set
    'charset' => 'utf8mb4',

    // PDO options
    'options' => [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ],
];
