<div class="max-w-4xl">
    <div class="flex items-center justify-between mb-6">
        <p class="text-sm text-gray-500">
            <a href="<?= url('/dashboard/events/' . $event['id']) ?>" class="text-brand-600 hover:text-brand-700">&larr; Volver al evento</a>
        </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="stat-card">
            <span class="stat-label">Total</span>
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
        <h3 class="font-medium text-gray-900 mb-4">Agregar invitado</h3>
        <form action="<?= url('/dashboard/events/' . $event['id'] . '/guests') ?>" method="POST" class="flex flex-wrap gap-3 items-end">
            <?php include __DIR__ . '/../../partials/csrf_field.php'; ?>
            <div class="flex-1 min-w-[200px]">
                <label for="name" class="label">Nombre</label>
                <input type="text" id="name" name="name" required class="input" placeholder="Nombre del invitado">
            </div>
            <div class="w-48">
                <label for="email" class="label">Email (opcional)</label>
                <input type="email" id="email" name="email" class="input" placeholder="email@ejemplo.com">
            </div>
            <div class="w-36">
                <label for="phone" class="label">Teléfono</label>
                <input type="text" id="phone" name="phone" class="input" placeholder="5512345678">
            </div>
            <div class="w-24">
                <label for="max_companions" class="label">Acomp.</label>
                <input type="number" id="max_companions" name="max_companions" value="0" min="0" max="10" class="input">
            </div>
            <button type="submit" class="btn-primary">Agregar</button>
        </form>
    </div>

    <?php if (empty($guests)): ?>
        <div class="card text-center py-12">
            <p class="text-gray-400">No hay invitados aún.</p>
        </div>
    <?php else: ?>
        <div class="table-container">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th class="text-left px-6 py-3 font-medium text-gray-500">Nombre</th>
                        <th class="text-left px-6 py-3 font-medium text-gray-500">Contacto</th>
                        <th class="text-left px-6 py-3 font-medium text-gray-500">Estado</th>
                        <th class="text-left px-6 py-3 font-medium text-gray-500">Link RSVP</th>
                        <th class="text-right px-6 py-3 font-medium text-gray-500">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    <?php foreach ($guests as $guest): ?>
                    <tr>
                        <td class="px-6 py-4 text-gray-900"><?= e($guest['name']) ?></td>
                        <td class="px-6 py-4 text-gray-500"><?= e($guest['email'] ?? $guest['phone'] ?? '-') ?></td>
                        <td class="px-6 py-4">
                            <span class="badge <?= $guest['rsvp_status'] === 'confirmado' ? 'badge-success' : ($guest['rsvp_status'] === 'cancelado' ? 'badge-error' : 'badge-warning') ?>">
                                <?= e(ucfirst($guest['rsvp_status'])) ?>
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <button onclick="navigator.clipboard.writeText('<?= e(url('/e/' . $event['slug'] . '/rsvp/' . $guest['token'])) ?>'); this.textContent='Copiado!'; setTimeout(()=>this.textContent='Copiar',2000)" class="text-xs text-brand-600 hover:text-brand-700">Copiar</button>
                        </td>
                        <td class="px-6 py-4 text-right">
                            <form action="<?= url('/dashboard/events/' . $event['id'] . '/guests/' . $guest['id'] . '/delete') ?>" method="POST" class="inline" onsubmit="return confirm('¿Eliminar invitado?')">
                                <?php include __DIR__ . '/../../partials/csrf_field.php'; ?>
                                <button type="submit" class="text-xs text-red-500 hover:text-red-700">Eliminar</button>
                            </form>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>
