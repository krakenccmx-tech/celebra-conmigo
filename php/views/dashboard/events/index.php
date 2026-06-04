<div class="flex items-center justify-between mb-6">
    <div></div>
    <a href="<?= url('/dashboard/events/create') ?>" class="btn-primary">Crear Evento</a>
</div>

<?php if (empty($events)): ?>
    <div class="card text-center py-16">
        <svg class="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        <p class="text-gray-400 mb-2">No tienes eventos creados</p>
        <a href="<?= url('/dashboard/events/create') ?>" class="text-brand-600 hover:text-brand-700 text-sm font-medium">Crear mi primer evento</a>
    </div>
<?php else: ?>
    <div class="grid gap-4">
        <?php foreach ($events as $event): ?>
        <div class="card flex items-center justify-between">
            <div class="flex-1">
                <div class="flex items-center gap-3">
                    <a href="<?= url('/dashboard/events/' . $event['id']) ?>" class="font-medium text-gray-900 hover:text-brand-600 transition"><?= e($event['title']) ?></a>
                    <span class="badge <?= $event['status'] === 'published' ? 'badge-success' : 'badge-neutral' ?>"><?= e(ucfirst($event['status'])) ?></span>
                </div>
                <p class="text-sm text-gray-400 mt-1"><?= e($event['type']) ?> · <?= e($event['city']) ?> · <?= e($event['event_date']) ?></p>
            </div>
            <div class="flex items-center gap-2">
                <a href="<?= url('/dashboard/events/' . $event['id'] . '/edit') ?>" class="text-sm text-gray-400 hover:text-gray-600 transition px-3 py-1">Editar</a>
                <a href="<?= url('/dashboard/events/' . $event['id'] . '/guests') ?>" class="text-sm text-gray-400 hover:text-gray-600 transition px-3 py-1">Invitados</a>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
<?php endif; ?>
