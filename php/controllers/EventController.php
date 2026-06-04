<?php

class EventController extends Controller
{
    private Event $eventModel;
    private Guest $guestModel;

    public function __construct()
    {
        $this->middleware('auth');
        $this->eventModel = new Event();
        $this->guestModel = new Guest();
    }

    public function index(): void
    {
        $events = $this->eventModel->findByUserId(Auth::id());
        $this->view('dashboard/events/index', [
            'title' => 'Mis Eventos',
            'pageTitle' => 'Mis Eventos',
            'events' => $events,
        ], 'dashboard');
    }

    public function create(): void
    {
        $this->view('dashboard/events/create', [
            'title' => 'Crear Evento',
            'pageTitle' => 'Crear Evento',
        ], 'dashboard');
    }

    public function store(): void
    {
        Session::validateCsrf($_POST['csrf_token'] ?? '');

        $title = sanitize($_POST['title'] ?? '');
        $type = sanitize($_POST['type'] ?? '');
        $eventDate = sanitize($_POST['event_date'] ?? '');
        $eventTime = sanitize($_POST['event_time'] ?? '');
        $city = sanitize($_POST['city'] ?? '');
        $venueName = sanitize($_POST['venue_name'] ?? '');
        $venueAddress = sanitize($_POST['venue_address'] ?? '');
        $description = sanitize($_POST['description'] ?? '');
        $maxGuests = (int) ($_POST['max_guests'] ?? 100);

        Session::setOldInput($_POST);

        $errors = [];
        if (!$title) $errors[] = 'El título es obligatorio.';
        if (!$type) $errors[] = 'El tipo de evento es obligatorio.';
        if (!$eventDate) $errors[] = 'La fecha es obligatoria.';
        if (!$eventTime) $errors[] = 'La hora es obligatoria.';
        if (!$city) $errors[] = 'La ciudad es obligatoria.';

        if ($errors) {
            flash('error', implode(' ', $errors));
            redirect(url('/dashboard/events/create'));
        }

        $baseSlug = slug($title);
        $slugCandidate = $baseSlug;
        $counter = 1;
        while ($this->eventModel->slugExists($slugCandidate)) {
            $slugCandidate = $baseSlug . '-' . $counter++;
        }

        $id = $this->eventModel->create([
            'user_id' => Auth::id(),
            'title' => $title,
            'slug' => $slugCandidate,
            'type' => $type,
            'event_date' => $eventDate,
            'event_time' => $eventTime,
            'city' => $city,
            'venue_name' => $venueName,
            'venue_address' => $venueAddress,
            'description' => $description,
            'max_guests' => $maxGuests,
            'status' => 'draft',
        ]);

        Session::clearOldInput();
        flash('success', 'Evento creado exitosamente.');
        redirect(url('/dashboard/events/' . $id));
    }

    public function show(string $id): void
    {
        $event = $this->eventModel->findById($id);
        if (!$event || $event['user_id'] !== Auth::id()) {
            flash('error', 'Evento no encontrado.');
            redirect(url('/dashboard/events'));
        }
        $stats = $this->guestModel->getStatsByEvent($id);
        $this->view('dashboard/events/show', [
            'title' => $event['title'],
            'pageTitle' => $event['title'],
            'event' => $event,
            'stats' => $stats,
        ], 'dashboard');
    }

    public function edit(string $id): void
    {
        $event = $this->eventModel->findById($id);
        if (!$event || $event['user_id'] !== Auth::id()) {
            flash('error', 'Evento no encontrado.');
            redirect(url('/dashboard/events'));
        }
        $this->view('dashboard/events/edit', [
            'title' => 'Editar: ' . $event['title'],
            'pageTitle' => 'Editar Evento',
            'event' => $event,
        ], 'dashboard');
    }

    public function update(string $id): void
    {
        Session::validateCsrf($_POST['csrf_token'] ?? '');
        $event = $this->eventModel->findById($id);
        if (!$event || $event['user_id'] !== Auth::id()) {
            redirect(url('/dashboard/events'));
        }

        $data = [
            'title' => sanitize($_POST['title'] ?? ''),
            'type' => sanitize($_POST['type'] ?? ''),
            'event_date' => sanitize($_POST['event_date'] ?? ''),
            'event_time' => sanitize($_POST['event_time'] ?? ''),
            'city' => sanitize($_POST['city'] ?? ''),
            'venue_name' => sanitize($_POST['venue_name'] ?? ''),
            'venue_address' => sanitize($_POST['venue_address'] ?? ''),
            'venue_map_url' => sanitize($_POST['venue_map_url'] ?? ''),
            'description' => sanitize($_POST['description'] ?? ''),
            'max_guests' => (int) ($_POST['max_guests'] ?? 100),
        ];

        if (!$data['title'] || !$data['event_date'] || !$data['event_time'] || !$data['city']) {
            flash('error', 'Los campos obligatorios no pueden estar vacíos.');
            redirect(url('/dashboard/events/' . $id . '/edit'));
        }

        $this->eventModel->update($id, $data);
        flash('success', 'Evento actualizado.');
        redirect(url('/dashboard/events/' . $id));
    }

    public function delete(string $id): void
    {
        Session::validateCsrf($_POST['csrf_token'] ?? '');
        $event = $this->eventModel->findById($id);
        if (!$event || $event['user_id'] !== Auth::id()) {
            redirect(url('/dashboard/events'));
        }
        $this->eventModel->delete($id);
        flash('success', 'Evento eliminado.');
        redirect(url('/dashboard/events'));
    }

    public function publish(string $id): void
    {
        Session::validateCsrf($_POST['csrf_token'] ?? '');
        $event = $this->eventModel->findById($id);
        if (!$event || $event['user_id'] !== Auth::id()) {
            redirect(url('/dashboard/events'));
        }
        $this->eventModel->publish($id);
        flash('success', 'Evento publicado.');
        redirect(url('/dashboard/events/' . $id));
    }

    public function unpublish(string $id): void
    {
        Session::validateCsrf($_POST['csrf_token'] ?? '');
        $event = $this->eventModel->findById($id);
        if (!$event || $event['user_id'] !== Auth::id()) {
            redirect(url('/dashboard/events'));
        }
        $this->eventModel->unpublish($id);
        flash('success', 'Evento despublicado.');
        redirect(url('/dashboard/events/' . $id));
    }
}
