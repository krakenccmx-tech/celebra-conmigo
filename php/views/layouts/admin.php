<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($title ?? 'Admin') ?> - Celebra Conmigo</title>
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
        <aside class="w-64 bg-gray-900 text-white flex flex-col">
            <div class="px-6 py-5 border-b border-gray-800">
                <a href="<?= url('/admin') ?>" class="text-lg font-semibold">Admin Panel</a>
            </div>
            <nav class="flex-1 px-4 py-6 space-y-1">
                <a href="<?= url('/admin') ?>" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-800 transition">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                    Dashboard
                </a>
                <a href="<?= url('/admin/users') ?>" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-800 transition">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/></svg>
                    Usuarios
                </a>
                <a href="<?= url('/admin/events') ?>" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-800 transition">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    Eventos
                </a>
            </nav>
            <div class="px-4 py-4 border-t border-gray-800">
                <a href="<?= url('/dashboard') ?>" class="text-xs text-gray-400 hover:text-white transition">Volver al dashboard</a>
            </div>
        </aside>
        <div class="flex-1 flex flex-col">
            <header class="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h1 class="text-lg font-semibold text-gray-800"><?= e($pageTitle ?? 'Admin') ?></h1>
                <form action="<?= url('/logout') ?>" method="POST" class="inline">
                    <?php include __DIR__ . '/../partials/csrf_field.php'; ?>
                    <button type="submit" class="text-sm text-gray-400 hover:text-gray-600 transition">Salir</button>
                </form>
            </header>
            <main class="flex-1 p-6">
                <?php include __DIR__ . '/../partials/alerts.php'; ?>
                <?= $content ?>
            </main>
        </div>
    </div>
</body>
</html>
