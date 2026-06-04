<div class="text-center mb-8">
    <a href="<?= url('/') ?>" class="text-2xl font-semibold text-gray-900 tracking-tight">
        Celebra <span class="text-brand-600">Conmigo</span>
    </a>
    <p class="mt-2 text-sm text-gray-500">Inicia sesión en tu cuenta</p>
</div>

<form action="<?= url('/login') ?>" method="POST" class="space-y-5">
    <?php include __DIR__ . '/../partials/csrf_field.php'; ?>

    <div>
        <label for="email" class="label">Correo electrónico</label>
        <input type="email" id="email" name="email" value="<?= e(old('email')) ?>" required autofocus class="input" placeholder="tu@email.com">
    </div>

    <div>
        <label for="password" class="label">Contraseña</label>
        <input type="password" id="password" name="password" required class="input" placeholder="••••••••">
    </div>

    <button type="submit" class="w-full btn-primary py-3">
        Iniciar Sesión
    </button>
</form>

<p class="mt-6 text-center text-sm text-gray-500">
    ¿No tienes cuenta?
    <a href="<?= url('/register') ?>" class="text-brand-600 hover:text-brand-700 font-medium">Crear cuenta</a>
</p>
