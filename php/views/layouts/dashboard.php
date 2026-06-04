<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($title ?? 'Dashboard') ?> - Celebra Conmigo</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= asset('css/app.css') ?>">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
                    colors: { brand: { 50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 300: '#f0abfc', 400: '#e879f9', 500: '#d946ef', 600: '#c026d3', 700: '#a21caf', 800: '#86198f', 900: '#701a75' } }
                }
            }
        }
    </script>
</head>
<body class="font-sans bg-gray-50 text-gray-900 antialiased min-h-screen">
    <div class="flex min-h-screen">
        <?php include __DIR__ . '/../partials/sidebar.php'; ?>
        <div class="flex-1 flex flex-col">
            <header class="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h1 class="text-lg font-semibold text-gray-800"><?= e($pageTitle ?? 'Dashboard') ?></h1>
                <div class="flex items-center gap-4">
                    <span class="text-sm text-gray-500"><?= e(Auth::user()['name'] ?? '') ?></span>
                    <form action="<?= url('/logout') ?>" method="POST" class="inline">
                        <?php include __DIR__ . '/../partials/csrf_field.php'; ?>
                        <button type="submit" class="text-sm text-gray-400 hover:text-gray-600 transition">Salir</button>
                    </form>
                </div>
            </header>
            <main class="flex-1 p-6">
                <?php include __DIR__ . '/../partials/alerts.php'; ?>
                <?= $content ?>
            </main>
        </div>
    </div>
    <script src="<?= asset('js/app.js') ?>"></script>
</body>
</html>
