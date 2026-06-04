<?php

declare(strict_types=1);

class Router
{
    private array $routes;

    public function __construct(array $routes)
    {
        $this->routes = $routes;
    }

    public function resolve(string $method, string $uri): ?array
    {
        $uri = '/' . trim($uri, '/');
        $method = strtoupper($method);

        foreach ($this->routes as $routeKey => $handler) {
            [$routeMethod, $routePath] = explode(' ', $routeKey, 2);

            if ($routeMethod !== $method) {
                continue;
            }

            $pattern = $this->convertToRegex($routePath);

            if (preg_match($pattern, $uri, $matches)) {
                $params = array_filter($matches, fn($key) => !is_numeric($key), ARRAY_FILTER_USE_KEY);
                return [
                    'controller' => $handler[0],
                    'method' => $handler[1],
                    'params' => array_values($params),
                ];
            }
        }

        return null;
    }

    private function convertToRegex(string $route): string
    {
        $pattern = preg_replace('/\{([a-zA-Z_]+)\}/', '(?P<$1>[^/]+)', $route);
        return '#^' . $pattern . '$#';
    }

    public function dispatch(): void
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = $_GET['url'] ?? '';
        $uri = '/' . trim(filter_var($uri, FILTER_SANITIZE_URL), '/');

        $route = $this->resolve($method, $uri);

        if (!$route) {
            http_response_code(404);
            include __DIR__ . '/../views/errors/404.php';
            return;
        }

        $controllerName = $route['controller'];
        $methodName = $route['method'];
        $params = $route['params'];

        if (!class_exists($controllerName)) {
            http_response_code(500);
            error_log("Controller not found: {$controllerName}");
            include __DIR__ . '/../views/errors/500.php';
            return;
        }

        $controller = new $controllerName();

        if (!method_exists($controller, $methodName)) {
            http_response_code(500);
            error_log("Method not found: {$controllerName}::{$methodName}");
            include __DIR__ . '/../views/errors/500.php';
            return;
        }

        call_user_func_array([$controller, $methodName], $params);
    }
}
