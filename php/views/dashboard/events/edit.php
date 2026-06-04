<form action="<?= url('/dashboard/events/' . $event['id'] . '/edit') ?>" method="POST" class="card max-w-2xl">
    <?php include __DIR__ . '/../../partials/csrf_field.php'; ?>

    <div class="space-y-6">
        <div>
            <label for="title" class="label">Título del evento</label>
            <input type="text" id="title" name="title" value="<?= e($event['title']) ?>" required class="input">
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label for="type" class="label">Tipo de evento</label>
                <select id="type" name="type" required class="input">
                    <option value="boda" <?= $event['type'] === 'boda' ? 'selected' : '' ?>>Boda</option>
                    <option value="xv" <?= $event['type'] === 'xv' ? 'selected' : '' ?>>XV Años</option>
                    <option value="bautizo" <?= $event['type'] === 'bautizo' ? 'selected' : '' ?>>Bautizo</option>
                    <option value="cumpleanos" <?= $event['type'] === 'cumpleanos' ? 'selected' : '' ?>>Cumpleaños</option>
                    <option value="graduacion" <?= $event['type'] === 'graduacion' ? 'selected' : '' ?>>Graduación</option>
                    <option value="baby_shower" <?= $event['type'] === 'baby_shower' ? 'selected' : '' ?>>Baby Shower</option>
                    <option value="otro" <?= $event['type'] === 'otro' ? 'selected' : '' ?>>Otro</option>
                </select>
            </div>
            <div>
                <label for="max_guests" class="label">Máximo de invitados</label>
                <input type="number" id="max_guests" name="max_guests" value="<?= e((string)$event['max_guests']) ?>" min="1" class="input">
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label for="event_date" class="label">Fecha</label>
                <input type="date" id="event_date" name="event_date" value="<?= e($event['event_date']) ?>" required class="input">
            </div>
            <div>
                <label for="event_time" class="label">Hora</label>
                <input type="time" id="event_time" name="event_time" value="<?= e($event['event_time']) ?>" required class="input">
            </div>
        </div>

        <div>
            <label for="city" class="label">Ciudad</label>
            <input type="text" id="city" name="city" value="<?= e($event['city']) ?>" required class="input">
        </div>

        <div>
            <label for="venue_name" class="label">Nombre del lugar</label>
            <input type="text" id="venue_name" name="venue_name" value="<?= e($event['venue_name'] ?? '') ?>" class="input">
        </div>

        <div>
            <label for="venue_address" class="label">Dirección</label>
            <input type="text" id="venue_address" name="venue_address" value="<?= e($event['venue_address'] ?? '') ?>" class="input">
        </div>

        <div>
            <label for="venue_map_url" class="label">Link de Google Maps (opcional)</label>
            <input type="url" id="venue_map_url" name="venue_map_url" value="<?= e($event['venue_map_url'] ?? '') ?>" class="input" placeholder="https://maps.google.com/...">
        </div>

        <div>
            <label for="description" class="label">Descripción</label>
            <textarea id="description" name="description" rows="3" class="input"><?= e($event['description'] ?? '') ?></textarea>
        </div>

        <div class="flex items-center gap-4 pt-4">
            <button type="submit" class="btn-primary">Guardar Cambios</button>
            <a href="<?= url('/dashboard/events/' . $event['id']) ?>" class="btn-secondary">Cancelar</a>
        </div>
    </div>
</form>
