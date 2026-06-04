<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <div class="stat-card">
        <span class="stat-label">Total Eventos</span>
        <span class="stat-value"><?= $totalEvents ?></span>
    </div>
    <div class="stat-card">
        <span class="stat-label">Publicados</span>
        <span class="stat-value"><?= $publishedEvents ?></span>
    </div>
    <div class="stat-card">
        <span class="stat-label">Total Invitados</span>
        <span class="stat-value"><?= $totalGuests ?></span>
    </div>
    <div class="stat-card">
        <span class="stat-label">Confirmados</span>
        <span class="stat-value"><?= $confirmedGuests ?></span>
    </div>
</div>

<div class="card">
    <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-medium text-gray-900">Eventos Recientes</h2>
        <a href="<?= url('/dashboard/events/create') ?>" class="btn-primary">Crear Evento</a>
    </div>
    <?php if (empty($recentEvents)): ?>
        <div class="text-center py-12">
            <p class="text-gray-400">No tienes eventos aún.</p>
            <a href="<?= url('/dashboard/events/create') ?>" class="mt-4 inline-block text-brand-600 hover:text-brand-700 text-sm font-medium">Crea tu primer evento</a>
        </div>
    <?php else: ?>
        <div class="divide-y divide-gray-50">
            <?php foreach ($recentEvents as $event): ?>
            <div class="py-4 flex items-center justify-between">
                <div>
                    <a href="<?= url('/dashboard/events/' . $event['id']) ?>" class="font-medium text-gray-900 hover:text-brand-600 transition"><?= e($event['title']) ?></a>
                    <p class="text-sm text-gray-400 mt-0.5"><?= e($event['city']) ?> · <?= e($event['event_date']) ?></p>
                </div>
                <span class="badge <?= $event['status'] === 'published' ? 'badge-success' : ($event['status'] === 'draft' ? 'badge-neutral' : 'badge-warning') ?>">
                    <?= e(ucfirst($event['status'])) ?>
                </span>
            </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>
