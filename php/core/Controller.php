<?php

declare(strict_types=1);

class Controller
{
    protected function view(string $template, array $data = [], string $layout = 'main'): void
    {
        extract($data);
        ob_start();
        include __DIR__ . '/../views/' . $template . '.php';
        $content = ob_get_clean();
        include __DIR__ . '/../views/layouts/' . $layout . '.php';
    }

    protected function middleware(string $type): void
    {
        match ($type) {
            'auth' => $this->requireAuth(),
            'admin' => $this->requireAdmin(),
            default => null,
        };
    }

    private function requireAuth(): void
    {
        if (!Auth::check()) {
            flash('error', 'Debes iniciar sesión.');
            redirect(url('/login'));
        }
    }

    private function requireAdmin(): void
    {
        if (!Auth::check() || !Auth::isAdmin()) {
            http_response_code(403);
            include __DIR__ . '/../views/errors/403.php';
            exit;
        }
    }
}
