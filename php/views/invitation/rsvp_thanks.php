<div class="max-w-lg mx-auto py-12 text-center">
    <div class="w-16 h-16 rounded-full <?= $status === 'confirmado' ? 'bg-green-50' : 'bg-gray-100' ?> flex items-center justify-center mx-auto mb-6">
        <?php if ($status === 'confirmado'): ?>
        <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        <?php else: ?>
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        <?php endif; ?>
    </div>
    <h1 class="text-2xl font-semibold text-gray-900 mb-2">
        <?= $status === 'confirmado' ? '¡Gracias por confirmar!' : 'Respuesta registrada' ?>
    </h1>
    <p class="text-gray-500 mb-6">
        <?= $status === 'confirmado' ? 'Te esperamos en ' . e($event['title']) . '.' : 'Lamentamos que no puedas asistir.' ?>
    </p>
    <a href="<?= url('/e/' . $event['slug']) ?>" class="text-brand-600 hover:text-brand-700 text-sm font-medium">Ver invitación</a>
</div>
