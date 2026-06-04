<?php

class GuestController extends Controller
{
    private Guest $guestModel;
    private Event $eventModel;

    public function __construct()
    {
        $this->middleware('auth');
        $this->guestModel = new Guest();
        $this->eventModel = new Event();
    }

    public function index(string $eventId): void
    {
        $event = $this->eventModel->findById($eventId);
        if (!$event || $event['user_id'] !== Auth::id()) {
            flash('error', 'Evento no encontrado.');
            redirect(url('/dashboard/events'));
        }

        $guests = $this->guestModel->findByEventId($eventId);
        $stats = $this->guestModel->getStatsByEvent($eventId);

        $this->view('dashboard/guests/index', [
            'title' => 'Invitados - ' . $event['title'],
            'pageTitle' => 'Invitados',
            'event' => $event,
            'guests' => $guests,
            'stats' => $stats,
        ], 'dashboard');
    }

    public function store(string $eventId): void
    {
        Session::validateCsrf($_POST['csrf_token'] ?? '');

        $event = $this->eventModel->findById($eventId);
        if (!$event || $event['user_id'] !== Auth::id()) {
            redirect(url('/dashboard/events'));
        }

        $name = sanitize($_POST['name'] ?? '');
        $email = sanitize($_POST['email'] ?? '');
        $phone = sanitize($_POST['phone'] ?? '');
        $maxCompanions = (int) ($_POST['max_companions'] ?? 0);

        if (!$name) {
            flash('error', 'El nombre del invitado es obligatorio.');
            redirect(url('/dashboard/events/' . $eventId . '/guests'));
        }

        $token = $this->guestModel->generateUniqueToken();

        $this->guestModel->create([
            'event_id' => $eventId,
            'name' => $name,
            'email' => $email ?: null,
            'phone' => $phone ?: null,
            'max_companions' => $maxCompanions,
            'token' => $token,
        ]);

        flash('success', 'Invitado agregado.');
        redirect(url('/dashboard/events/' . $eventId . '/guests'));
    }

    public function delete(string $eventId, string $guestId): void
    {
        Session::validateCsrf($_POST['csrf_token'] ?? '');

        $event = $this->eventModel->findById($eventId);
        if (!$event || $event['user_id'] !== Auth::id()) {
            redirect(url('/dashboard/events'));
        }

        $this->guestModel->delete($guestId);
        flash('success', 'Invitado eliminado.');
        redirect(url('/dashboard/events/' . $eventId . '/guests'));
    }
}
