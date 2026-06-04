<?php

declare(strict_types=1);

/**
 * Authentication helper.
 */
class Auth
{
    private static ?array $currentUser = null;

    /**
     * Log a user in by storing their data in the session.
     */
    public static function login(array $user): void
    {
        session_regenerate_id(true);
        Session::set('user_id', $user['id']);
        Session::set('user_role', $user['role']);
    }

    /**
     * Log the current user out.
     */
    public static function logout(): void
    {
        self::$currentUser = null;
        Session::destroy();
    }

    /**
     * Check if a user is authenticated.
     */
    public static function check(): bool
    {
        return Session::has('user_id');
    }

    /**
     * Get the full user record from the database (cached).
     */
    public static function user(): ?array
    {
        if (!self::check()) {
            return null;
        }

        if (self::$currentUser === null) {
            $db = Database::getInstance();
            $stmt = $db->prepare('SELECT * FROM users WHERE id = :id LIMIT 1');
            $stmt->execute(['id' => self::id()]);
            self::$currentUser = $stmt->fetch() ?: null;
        }

        return self::$currentUser;
    }

    /**
     * Get the authenticated user's ID.
     */
    public static function id(): ?string
    {
        return Session::get('user_id');
    }

    /**
     * Check if the authenticated user is a superadmin.
     */
    public static function isAdmin(): bool
    {
        return Session::get('user_role') === 'superadmin';
    }

    /**
     * Attempt to authenticate with email and password.
     * Returns the user array on success, false on failure.
     */
    public static function attemptLogin(string $email, string $password): array|false
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password'])) {
            return false;
        }

        self::login($user);
        return $user;
    }
}
