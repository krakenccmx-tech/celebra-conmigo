<div class="max-w-lg mx-auto py-12">
    <div class="text-center mb-8">
        <h1 class="text-2xl font-semibold text-gray-900"><?= e($event['title']) ?></h1>
        <p class="mt-2 text-sm text-gray-500">Hola, <?= e($guest['name']) ?></p>
    </div>

    <?php if ($existingRsvp): ?>
    <div class="card text-center mb-6">
        <p class="text-sm text-gray-500">Ya confirmaste tu asistencia como:</p>
        <p class="mt-1 font-medium <?= $existingRsvp['status'] === 'confirmado' ? 'text-green-600' : 'text-red-600' ?>"><?= e(ucfirst($existingRsvp['status'])) ?></p>
        <p class="mt-2 text-xs text-gray-400">Puedes actualizar tu respuesta abajo.</p>
    </div>
    <?php endif; ?>

    <form action="<?= url('/e/' . $event['slug'] . '/rsvp/' . $guest['token']) ?>" method="POST" class="card">
        <?php include __DIR__ . '/../partials/csrf_field.php'; ?>

        <div class="space-y-6">
            <div>
                <label class="label">¿Asistirás?</label>
                <div class="flex gap-4 mt-2">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="status" value="confirmado" required class="text-brand-600" <?= ($existingRsvp['status'] ?? '') === 'confirmado' ? 'checked' : '' ?>>
                        <span class="text-sm">Sí, asistiré</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="status" value="cancelado" required class="text-brand-600" <?= ($existingRsvp['status'] ?? '') === 'cancelado' ? 'checked' : '' ?>>
                        <span class="text-sm">No podré asistir</span>
                    </label>
                </div>
            </div>

            <?php if ($guest['max_companions'] > 0): ?>
            <div>
                <label for="companions_count" class="label">¿Cuántos acompañantes? (máx <?= $guest['max_companions'] ?>)</label>
                <input type="number" id="companions_count" name="companions_count" min="0" max="<?= $guest['max_companions'] ?>" value="<?= $existingRsvp['companions_count'] ?? 0 ?>" class="input w-24">
            </div>
            <div>
                <label for="companions_names" class="label">Nombres de acompañantes</label>
                <input type="text" id="companions_names" name="companions_names" value="<?= e($existingRsvp['companions_names'] ?? '') ?>" class="input" placeholder="Separados por coma">
            </div>
            <?php endif; ?>

            <div>
                <label for="food_restrictions" class="label">Restricciones alimentarias (opcional)</label>
                <input type="text" id="food_restrictions" name="food_restrictions" value="<?= e($existingRsvp['food_restrictions'] ?? '') ?>" class="input" placeholder="Alergias, vegetariano, etc.">
            </div>

            <div>
                <label for="message" class="label">Mensaje (opcional)</label>
                <textarea id="message" name="message" rows="3" class="input" placeholder="Un mensaje para los anfitriones"><?= e($existingRsvp['message'] ?? '') ?></textarea>
            </div>

            <button type="submit" class="w-full btn-primary py-3">Enviar Confirmación</button>
        </div>
    </form>
</div>
