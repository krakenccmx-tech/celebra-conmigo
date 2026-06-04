<?php

declare(strict_types=1);

/**
 * Celebra Conmigo - Application Configuration
 */

define('APP_NAME', 'Celebra Conmigo');
define('APP_VERSION', '1.0.0');
define('APP_ENV', 'production');

// Detect base URL from server or use fallback
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
define('BASE_URL', rtrim($protocol . '://' . $host, '/'));

// Upload constraints
define('UPLOAD_MAX_SIZE', 5242880); // 5MB
define('ALLOWED_IMAGE_TYPES', [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
]);
