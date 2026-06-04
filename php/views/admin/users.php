<div class="table-container">
    <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
                <th class="text-left px-6 py-3 font-medium text-gray-500">Nombre</th>
                <th class="text-left px-6 py-3 font-medium text-gray-500">Email</th>
                <th class="text-left px-6 py-3 font-medium text-gray-500">Plan</th>
                <th class="text-left px-6 py-3 font-medium text-gray-500">Rol</th>
                <th class="text-left px-6 py-3 font-medium text-gray-500">Registro</th>
                <th class="text-right px-6 py-3 font-medium text-gray-500">Acciones</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
            <?php foreach ($users as $user): ?>
            <tr>
                <td class="px-6 py-4 text-gray-900 font-medium"><?= e($user['name']) ?></td>
                <td class="px-6 py-4 text-gray-500"><?= e($user['email']) ?></td>
                <td class="px-6 py-4"><span class="badge badge-neutral"><?= e($user['plan']) ?></span></td>
                <td class="px-6 py-4"><span class="badge <?= $user['role'] === 'superadmin' ? 'badge-info' : 'badge-neutral' ?>"><?= e($user['role']) ?></span></td>
                <td class="px-6 py-4 text-gray-400 text-xs"><?= e($user['created_at']) ?></td>
                <td class="px-6 py-4 text-right">
                    <?php if ($user['role'] !== 'superadmin'): ?>
                    <form action="<?= url('/admin/users/' . $user['id'] . '/toggle') ?>" method="POST" class="inline">
                        <?php include __DIR__ . '/../partials/csrf_field.php'; ?>
                        <button type="submit" class="text-xs text-brand-600 hover:text-brand-700">Cambiar rol</button>
                    </form>
                    <?php else: ?>
                    <span class="text-xs text-gray-300">-</span>
                    <?php endif; ?>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
