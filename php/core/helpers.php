<?php

declare(strict_types=1);

/**
 * Celebra Conmigo - Helper Functions
 */

/**
 * Escape output for HTML context.
 */
function e(?string $str): string
{
    return htmlspecialchars($str ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * Redirect to a URL and stop execution.
 */
function redirect(string $url): never
{
    header('Location: ' . $url);
    exit;
}

/**
 * Build a full URL from a relative path.
 */
function url(string $path = ''): string
{
    return BASE_URL . '/' . ltrim($path, '/');
}

/**
 * Build a URL for a public asset.
 */
function asset(string $path): string
{
    return url('public/' . ltrim($path, '/'));
}

/**
 * Retrieve old form input from session.
 */
function old(string $field, string $default = ''): string
{
    return $_SESSION['old_input'][$field] ?? $default;
}

/**
 * Generate a RFC 4122 compliant UUID v4.
 */
function uuid_v4(): string
{
    $data = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);

    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

/**
 * Convert a string to a URL-safe slug.
 */
function slug(string $text): string
{
    $text = transliterator_transliterate(
        'Any-Latin; Latin-ASCII; Lower()',
        $text
    );
    $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
    $text = preg_replace('/[\s-]+/', '-', $text);

    return trim($text, '-');
}

/**
 * Set or get a flash message.
 */
function flash(string $key, ?string $value = null): ?string
{
    if ($value !== null) {
        $_SESSION['flash'][$key] = $value;
        return null;
    }

    $message = $_SESSION['flash'][$key] ?? null;
    unset($_SESSION['flash'][$key]);
    return $message;
}

/**
 * Check if current request is POST.
 */
function isPost(): bool
{
    return $_SERVER['REQUEST_METHOD'] === 'POST';
}

/**
 * Check if current request is GET.
 */
function isGet(): bool
{
    return $_SERVER['REQUEST_METHOD'] === 'GET';
}

/**
 * Send a JSON response and stop execution.
 */
function jsonResponse(array $data, int $code = 200): never
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Sanitize input: trim and collapse whitespace.
 */
function sanitize(string $input): string
{
    return preg_replace('/\s+/', ' ', trim($input));
}
