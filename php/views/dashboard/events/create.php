<form action="<?= url('/dashboard/events/create') ?>" method="POST" class="card max-w-2xl">
    <?php include __DIR__ . '/../../partials/csrf_field.php'; ?>

    <div class="space-y-6">
        <div>
            <label for="title" class="label">Título del evento</label>
            <input type="text" id="title" name="title" value="<?= e(old('title')) ?>" required class="input" placeholder="Ej: Boda de María y Juan">
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label for="type" class="label">Tipo de evento</label>
                <select id="type" name="type" required class="input">
                    <option value="">Seleccionar...</option>
                    <option value="boda" <?= old('type') === 'boda' ? 'selected' : '' ?>>Boda</option>
                    <option value="xv" <?= old('type') === 'xv' ? 'selected' : '' ?>>XV Años</option>
                    <option value="bautizo" <?= old('type') === 'bautizo' ? 'selected' : '' ?>>Bautizo</option>
                    <option value="cumpleanos" <?= old('type') === 'cumpleanos' ? 'selected' : '' ?>>Cumpleaños</option>
                    <option value="graduacion" <?= old('type') === 'graduacion' ? 'selected' : '' ?>>Graduación</option>
                    <option value="baby_shower" <?= old('type') === 'baby_shower' ? 'selected' : '' ?>>Baby Shower</option>
                    <option value="otro" <?= old('type') === 'otro' ? 'selected' : '' ?>>Otro</option>
                </select>
            </div>
            <div>
                <label for="max_guests" class="label">Máximo de invitados</label>
                <input type="number" id="max_guests" name="max_guests" value="<?= e(old('max_guests', '100')) ?>" min="1" class="input">
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label for="event_date" class="label">Fecha</label>
                <input type="date" id="event_date" name="event_date" value="<?= e(old('event_date')) ?>" required class="input">
            </div>
            <div>
                <label for="event_time" class="label">Hora</label>
                <input type="time" id="event_time" name="event_time" value="<?= e(old('event_time')) ?>" required class="input">
            </div>
        </div>

        <div>
            <label for="city" class="label">Ciudad</label>
            <input type="text" id="city" name="city" value="<?= e(old('city')) ?>" required class="input" placeholder="Ej: Guadalajara, Jalisco">
        </div>

        <div>
            <label for="venue_name" class="label">Nombre del lugar</label>
            <input type="text" id="venue_name" name="venue_name" value="<?= e(old('venue_name')) ?>" class="input" placeholder="Ej: Salón Las Rosas">
        </div>

        <div>
            <label for="venue_address" class="label">Dirección del lugar</label>
            <input type="text" id="venue_address" name="venue_address" value="<?= e(old('venue_address')) ?>" class="input" placeholder="Dirección completa">
        </div>

        <div>
            <label for="description" class="label">Descripción (opcional)</label>
            <textarea id="description" name="description" rows="3" class="input" placeholder="Detalles adicionales del evento"><?= e(old('description')) ?></textarea>
        </div>

        <div class="flex items-center gap-4 pt-4">
            <button type="submit" class="btn-primary">Crear Evento</button>
            <a href="<?= url('/dashboard/events') ?>" class="btn-secondary">Cancelar</a>
        </div>
    </div>
</form>
