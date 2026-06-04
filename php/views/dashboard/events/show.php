<div class="max-w-4xl">
    <div class="flex items-center justify-between mb-6">
        <div>
            <span class="badge <?= $event['status'] === 'published' ? 'badge-success' : 'badge-neutral' ?>"><?= e(ucfirst($event['status'])) ?></span>
        </div>
        <div class="flex items-center gap-2">
            <?php if ($event['status'] === 'draft'): ?>
            <form action="<?= url('/dashboard/events/' . $event['id'] . '/publish') ?>" method="POST" class="inline">
                <?php include __DIR__ . '/../../partials/csrf_field.php'; ?>
                <button type="submit" class="btn-primary">Publicar</button>
            </form>
            <?php else: ?>
            <form action="<?= url('/dashboard/events/' . $event['id'] . '/unpublish') ?>" method="POST" class="inline">
                <?php include __DIR__ . '/../../partials/csrf_field.php'; ?>
                <button type="submit" class="btn-secondary">Despublicar</button>
            </form>
            <?php endif; ?>
            <a href="<?= url('/dashboard/events/' . $event['id'] . '/edit') ?>" class="btn-secondary">Editar</a>
            <a href="<?= url('/dashboard/events/' . $event['id'] . '/guests') ?>" class="btn-secondary">Invitados</a>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="stat-card">
            <span class="stat-label">Total invitados</span>
            <span class="stat-value"><?= (int)($stats['total'] ?? 0) ?></span>
        </div>
        <div class="stat-card">
            <span class="stat-label">Confirmados</span>
            <span class="stat-value text-green-600"><?= (int)($stats['confirmed'] ?? 0) ?></span>
        </div>
        <div class="stat-card">
            <span class="stat-label">Pendientes</span>
            <span class="stat-value text-amber-600"><?= (int)($stats['pending'] ?? 0) ?></span>
        </div>
    </div>

    <div class="card mb-6">
        <h3 class="font-medium text-gray-900 mb-4">Detalles del evento</h3>
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
                <dt class="text-gray-400">Tipo</dt>
                <dd class="mt-1 text-gray-900"><?= e(ucfirst($event['type'])) ?></dd>
            </div>
            <div>
                <dt class="text-gray-400">Fecha y hora</dt>
                <dd class="mt-1 text-gray-900"><?= e($event['event_date']) ?> a las <?= e($event['event_time']) ?></dd>
            </div>
            <div>
                <dt class="text-gray-400">Ciudad</dt>
                <dd class="mt-1 text-gray-900"><?= e($event['city']) ?></dd>
            </div>
            <div>
                <dt class="text-gray-400">Lugar</dt>
                <dd class="mt-1 text-gray-900"><?= e($event['venue_name'] ?? 'Sin definir') ?></dd>
            </div>
        </dl>
    </div>

    <?php if ($event['status'] === 'published'): ?>
    <div class="card">
        <h3 class="font-medium text-gray-900 mb-2">Link público de invitación</h3>
        <div class="flex items-center gap-3">
            <input type="text" readonly value="<?= e(url('/e/' . $event['slug'])) ?>" class="input flex-1 bg-gray-50" id="invitation-link">
            <button onclick="navigator.clipboard.writeText(document.getElementById('invitation-link').value); this.textContent='Copiado!'; setTimeout(()=>this.textContent='Copiar',2000)" class="btn-secondary">Copiar</button>
        </div>
    </div>
    <?php endif; ?>
</div>
