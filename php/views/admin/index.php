<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div class="stat-card">
        <span class="stat-label">Usuarios registrados</span>
        <span class="stat-value"><?= $totalUsers ?></span>
    </div>
    <div class="stat-card">
        <span class="stat-label">Total eventos</span>
        <span class="stat-value"><?= $totalEvents ?></span>
    </div>
    <div class="stat-card">
        <span class="stat-label">Eventos publicados</span>
        <span class="stat-value"><?= $publishedEvents ?></span>
    </div>
</div>

<div class="card">
    <h2 class="text-lg font-medium text-gray-900 mb-4">Usuarios recientes</h2>
    <?php if (empty($recentUsers)): ?>
        <p class="text-gray-400 text-sm">No hay usuarios registrados.</p>
    <?php else: ?>
        <div class="divide-y divide-gray-50">
            <?php foreach ($recentUsers as $user): ?>
            <div class="py-3 flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-900"><?= e($user['name']) ?></p>
                    <p class="text-xs text-gray-400"><?= e($user['email']) ?></p>
                </div>
                <span class="badge <?= $user['role'] === 'superadmin' ? 'badge-info' : 'badge-neutral' ?>"><?= e($user['role']) ?></span>
            </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>
