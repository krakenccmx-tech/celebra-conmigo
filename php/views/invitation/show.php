<div class="max-w-3xl mx-auto py-12">
    <div class="text-center mb-10">
        <h1 class="text-3xl lg:text-4xl font-semibold text-gray-900 tracking-tight"><?= e($event['title']) ?></h1>
        <p class="mt-3 text-gray-500"><?= e(ucfirst($event['type'])) ?></p>
    </div>

    <div class="card mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
                <p class="text-gray-400 mb-1">Fecha</p>
                <p class="text-gray-900 font-medium"><?= e($event['event_date']) ?> a las <?= e($event['event_time']) ?></p>
            </div>
            <div>
                <p class="text-gray-400 mb-1">Ciudad</p>
                <p class="text-gray-900 font-medium"><?= e($event['city']) ?></p>
            </div>
            <?php if ($event['venue_name']): ?>
            <div>
                <p class="text-gray-400 mb-1">Lugar</p>
                <p class="text-gray-900 font-medium"><?= e($event['venue_name']) ?></p>
            </div>
            <?php endif; ?>
            <?php if ($event['venue_address']): ?>
            <div>
                <p class="text-gray-400 mb-1">Dirección</p>
                <p class="text-gray-900 font-medium"><?= e($event['venue_address']) ?></p>
            </div>
            <?php endif; ?>
        </div>
    </div>

    <?php if ($event['description']): ?>
    <div class="card mb-6">
        <p class="text-gray-600 leading-relaxed"><?= nl2br(e($event['description'])) ?></p>
    </div>
    <?php endif; ?>

    <?php if ($event['venue_map_url']): ?>
    <div class="card mb-6 text-center">
        <a href="<?= e($event['venue_map_url']) ?>" target="_blank" rel="noopener" class="text-brand-600 hover:text-brand-700 text-sm font-medium">Ver ubicación en Google Maps &rarr;</a>
    </div>
    <?php endif; ?>
</div>
