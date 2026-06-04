<?php

declare(strict_types=1);

/**
 * Session management with secure defaults.
 */
class Session
{
    /**
     * Start session with secure configuration.
     */
    public static function start(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }

        ini_set('session.cookie_httponly', '1');
        ini_set('session.cookie_secure', '1');
        ini_set('session.cookie_samesite', 'Lax');
        ini_set('session.gc_maxlifetime', '7200'); // 2 hours
        ini_set('session.cookie_lifetime', '7200');
        ini_set('session.use_strict_mode', '1');

        session_start();
    }

    public static function set(string $key, mixed $value): void
    {
        $_SESSION[$key] = $value;
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        return $_SESSION[$key] ?? $default;
    }

    public static function has(string $key): bool
    {
        return isset($_SESSION[$key]);
    }

    public static function remove(string $key): void
    {
        unset($_SESSION[$key]);
    }

    /**
     * Destroy session completely.
     */
    public static function destroy(): void
    {
        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'],
                $params['secure'],
                $params['httponly']
            );
        }

        session_destroy();
    }

    /**
     * Generate a CSRF token and store it in session.
     */
    public static function generateCsrf(): string
    {
        $token = bin2hex(random_bytes(32));
        $_SESSION['csrf_token'] = $token;
        return $token;
    }

    /**
     * Validate a CSRF token against the stored one.
     */
    public static function validateCsrf(?string $token): bool
    {
        if ($token === null || !isset($_SESSION['csrf_token'])) {
            return false;
        }

        $valid = hash_equals($_SESSION['csrf_token'], $token);
        unset($_SESSION['csrf_token']);
        return $valid;
    }

    /**
     * Get or set a flash message.
     */
    public static function flash(string $key, ?string $value = null): ?string
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
     * Store form data for repopulation after redirect.
     */
    public static function setOldInput(array $data): void
    {
        $_SESSION['old_input'] = $data;
    }

    /**
     * Clear stored old input.
     */
    public static function clearOldInput(): void
    {
        unset($_SESSION['old_input']);
    }
}
