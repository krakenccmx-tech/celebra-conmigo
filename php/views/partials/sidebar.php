<aside class="w-64 bg-white border-r border-gray-100 flex flex-col">
    <div class="px-6 py-5 border-b border-gray-50">
        <a href="<?= url('/dashboard') ?>" class="text-lg font-semibold text-gray-900 tracking-tight">
            Celebra <span class="text-brand-600">Conmigo</span>
        </a>
    </div>
    <nav class="flex-1 px-4 py-6 space-y-1">
        <a href="<?= url('/dashboard') ?>" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm <?= strpos($_GET['url'] ?? '', 'dashboard/events') === false && ($_GET['url'] ?? '') === 'dashboard' ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50' ?> transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            Inicio
        </a>
        <a href="<?= url('/dashboard/events') ?>" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm <?= strpos($_GET['url'] ?? '', 'dashboard/events') !== false ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50' ?> transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            Mis Eventos
        </a>
    </nav>
    <div class="px-4 py-4 border-t border-gray-50">
        <p class="text-xs text-gray-400">Plan: <?= e(Auth::user()['plan'] ?? 'Starter') ?></p>
    </div>
</aside>
