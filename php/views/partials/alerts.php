<?php if ($msg = flash('success')): ?>
<div class="mb-4 p-4 bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl">
    <?= e($msg) ?>
</div>
<?php endif; ?>
<?php if ($msg = flash('error')): ?>
<div class="mb-4 p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl">
    <?= e($msg) ?>
</div>
<?php endif; ?>
<?php if ($msg = flash('info')): ?>
<div class="mb-4 p-4 bg-blue-50 border border-blue-100 text-blue-700 text-sm rounded-xl">
    <?= e($msg) ?>
</div>
<?php endif; ?>
