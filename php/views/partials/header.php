<header class="bg-white border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="<?= url('/') ?>" class="text-xl font-semibold text-gray-900 tracking-tight">
            Celebra <span class="text-brand-600">Conmigo</span>
        </a>
        <nav class="flex items-center gap-6">
            <?php if (Auth::check()): ?>
                <a href="<?= url('/dashboard') ?>" class="text-sm text-gray-600 hover:text-gray-900 transition">Mi Panel</a>
                <form action="<?= url('/logout') ?>" method="POST" class="inline">
                    <?php include __DIR__ . '/csrf_field.php'; ?>
                    <button type="submit" class="text-sm text-gray-400 hover:text-gray-600 transition">Salir</button>
                </form>
            <?php else: ?>
                <a href="<?= url('/login') ?>" class="text-sm text-gray-600 hover:text-gray-900 transition">Iniciar Sesión</a>
                <a href="<?= url('/register') ?>" class="text-sm bg-brand-600 text-white px-4 py-2 rounded-full hover:bg-brand-700 transition">Comenzar</a>
            <?php endif; ?>
        </nav>
    </div>
</header>
