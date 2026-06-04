<div class="table-container">
    <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
                <th class="text-left px-6 py-3 font-medium text-gray-500">Título</th>
                <th class="text-left px-6 py-3 font-medium text-gray-500">Usuario</th>
                <th class="text-left px-6 py-3 font-medium text-gray-500">Tipo</th>
                <th class="text-left px-6 py-3 font-medium text-gray-500">Fecha</th>
                <th class="text-left px-6 py-3 font-medium text-gray-500">Estado</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
            <?php foreach ($events as $event): ?>
            <tr>
                <td class="px-6 py-4 text-gray-900 font-medium"><?= e($event['title']) ?></td>
                <td class="px-6 py-4 text-gray-500 text-xs"><?= e($event['user_id']) ?></td>
                <td class="px-6 py-4 text-gray-500"><?= e(ucfirst($event['type'])) ?></td>
                <td class="px-6 py-4 text-gray-500"><?= e($event['event_date']) ?></td>
                <td class="px-6 py-4">
                    <span class="badge <?= $event['status'] === 'published' ? 'badge-success' : ($event['status'] === 'draft' ? 'badge-neutral' : 'badge-warning') ?>">
                        <?= e(ucfirst($event['status'])) ?>
                    </span>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
