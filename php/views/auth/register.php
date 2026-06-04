<div class="text-center mb-8">
    <a href="<?= url('/') ?>" class="text-2xl font-semibold text-gray-900 tracking-tight">
        Celebra <span class="text-brand-600">Conmigo</span>
    </a>
    <p class="mt-2 text-sm text-gray-500">Crea tu cuenta gratis</p>
</div>

<form action="<?= url('/register') ?>" method="POST" class="space-y-5">
    <?php include __DIR__ . '/../partials/csrf_field.php'; ?>

    <div>
        <label for="name" class="label">Nombre completo</label>
        <input type="text" id="name" name="name" value="<?= e(old('name')) ?>" required autofocus class="input" placeholder="Tu nombre">
    </div>

    <div>
        <label for="email" class="label">Correo electrónico</label>
        <input type="email" id="email" name="email" value="<?= e(old('email')) ?>" required class="input" placeholder="tu@email.com">
    </div>

    <div>
        <label for="password" class="label">Contraseña</label>
        <input type="password" id="password" name="password" required class="input" placeholder="Mínimo 8 caracteres">
    </div>

    <div>
        <label for="password_confirm" class="label">Confirmar contraseña</label>
        <input type="password" id="password_confirm" name="password_confirm" required class="input" placeholder="Repite tu contraseña">
    </div>

    <button type="submit" class="w-full btn-primary py-3">
        Crear Cuenta
    </button>
</form>

<p class="mt-6 text-center text-sm text-gray-500">
    ¿Ya tienes cuenta?
    <a href="<?= url('/login') ?>" class="text-brand-600 hover:text-brand-700 font-medium">Iniciar sesión</a>
</p>
