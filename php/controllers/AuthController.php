<?php

class AuthController extends Controller
{
    private User $userModel;

    public function __construct()
    {
        $this->userModel = new User();
    }

    public function showLogin(): void
    {
        if (Auth::check()) {
            redirect(url('/dashboard'));
        }
        $this->view('auth/login', ['title' => 'Iniciar Sesión'], 'auth');
    }

    public function login(): void
    {
        Session::validateCsrf($_POST['csrf_token'] ?? '');

        $attempts = Session::get('login_attempts', 0);
        $lastAttempt = Session::get('login_last_attempt', 0);

        if ($attempts >= 5 && (time() - $lastAttempt) < 900) {
            flash('error', 'Demasiados intentos. Espera 15 minutos.');
            redirect(url('/login'));
        }

        $email = sanitize($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        if (!$email || !$password) {
            flash('error', 'Todos los campos son obligatorios.');
            redirect(url('/login'));
        }

        $user = $this->userModel->findByEmail($email);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            Session::set('login_attempts', $attempts + 1);
            Session::set('login_last_attempt', time());
            flash('error', 'Credenciales incorrectas.');
            redirect(url('/login'));
        }

        Session::set('login_attempts', 0);
        Auth::login($user);

        if ($user['role'] === 'superadmin') {
            redirect(url('/admin'));
        }
        redirect(url('/dashboard'));
    }

    public function showRegister(): void
    {
        if (Auth::check()) {
            redirect(url('/dashboard'));
        }
        $this->view('auth/register', ['title' => 'Crear Cuenta'], 'auth');
    }

    public function register(): void
    {
        Session::validateCsrf($_POST['csrf_token'] ?? '');

        $name = sanitize($_POST['name'] ?? '');
        $email = sanitize($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $passwordConfirm = $_POST['password_confirm'] ?? '';

        Session::setOldInput(['name' => $name, 'email' => $email]);

        $errors = [];
        if (!$name) $errors[] = 'El nombre es obligatorio.';
        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Email inválido.';
        if (strlen($password) < 8) $errors[] = 'La contraseña debe tener al menos 8 caracteres.';
        if ($password !== $passwordConfirm) $errors[] = 'Las contraseñas no coinciden.';
        if ($email && $this->userModel->emailExists($email)) $errors[] = 'Este email ya está registrado.';

        if ($errors) {
            flash('error', implode(' ', $errors));
            redirect(url('/register'));
        }

        $this->userModel->createUser($name, $email, $password);
        $user = $this->userModel->findByEmail($email);
        Auth::login($user);

        flash('success', 'Cuenta creada exitosamente.');
        redirect(url('/dashboard'));
    }

    public function logout(): void
    {
        Auth::logout();
        redirect(url('/'));
    }
}
