<?php

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('admin');
    }

    public function index(): void
    {
        $userModel = new User();
        $eventModel = new Event();

        $totalUsers = $userModel->count(['role' => 'client']);
        $totalEvents = $eventModel->count();
        $publishedEvents = $eventModel->count(['status' => 'published']);
        $recentUsers = $userModel->getRecent(5);

        $this->view('admin/index', [
            'title' => 'Admin Dashboard',
            'pageTitle' => 'Panel de Administración',
            'totalUsers' => $totalUsers,
            'totalEvents' => $totalEvents,
            'publishedEvents' => $publishedEvents,
            'recentUsers' => $recentUsers,
        ], 'admin');
    }

    public function users(): void
    {
        $userModel = new User();
        $users = $userModel->findAll([], 'created_at DESC');

        $this->view('admin/users', [
            'title' => 'Usuarios',
            'pageTitle' => 'Gestión de Usuarios',
            'users' => $users,
        ], 'admin');
    }

    public function events(): void
    {
        $eventModel = new Event();
        $events = $eventModel->findAll([], 'created_at DESC');

        $this->view('admin/events', [
            'title' => 'Eventos',
            'pageTitle' => 'Todos los Eventos',
            'events' => $events,
        ], 'admin');
    }

    public function toggleUser(string $id): void
    {
        Session::validateCsrf($_POST['csrf_token'] ?? '');
        $userModel = new User();
        $user = $userModel->findById($id);

        if (!$user || $user['role'] === 'superadmin') {
            flash('error', 'Acción no permitida.');
            redirect(url('/admin/users'));
        }

        $newRole = $user['role'] === 'client' ? 'superadmin' : 'client';
        $userModel->update($id, ['role' => $newRole]);

        flash('success', 'Rol de usuario actualizado.');
        redirect(url('/admin/users'));
    }
}
