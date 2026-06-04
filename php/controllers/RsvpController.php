<?php

class RsvpController extends Controller
{
    private Guest $guestModel;
    private Event $eventModel;
    private Rsvp $rsvpModel;

    public function __construct()
    {
        $this->guestModel = new Guest();
        $this->eventModel = new Event();
        $this->rsvpModel = new Rsvp();
    }

    public function showForm(string $slug, string $token): void
    {
        $event = $this->eventModel->findBySlug($slug);
        if (!$event || $event['status'] !== 'published') {
            $this->view('errors/404', ['title' => 'No encontrado'], 'main');
            return;
        }

        $guest = $this->guestModel->findByToken($token);
        if (!$guest || $guest['event_id'] !== $event['id']) {
            $this->view('errors/404', ['title' => 'Invitación no válida'], 'main');
            return;
        }

        $existingRsvp = $this->rsvpModel->findByGuestId($guest['id']);

        $this->view('invitation/rsvp_form', [
            'title' => 'Confirmar Asistencia - ' . $event['title'],
            'event' => $event,
            'guest' => $guest,
            'existingRsvp' => $existingRsvp,
        ], 'main');
    }

    public function submit(string $slug, string $token): void
    {
        Session::validateCsrf($_POST['csrf_token'] ?? '');

        $event = $this->eventModel->findBySlug($slug);
        $guest = $this->guestModel->findByToken($token);

        if (!$event || !$guest || $guest['event_id'] !== $event['id']) {
            redirect(url('/'));
        }

        $status = sanitize($_POST['status'] ?? '');
        $companions = min((int) ($_POST['companions_count'] ?? 0), $guest['max_companions']);
        $companionNames = sanitize($_POST['companions_names'] ?? '');
        $restrictions = sanitize($_POST['food_restrictions'] ?? '');
        $message = sanitize($_POST['message'] ?? '');

        if (!in_array($status, ['confirmado', 'cancelado'])) {
            flash('error', 'Selecciona una opción válida.');
            redirect(url("/e/{$slug}/rsvp/{$token}"));
        }

        $this->rsvpModel->submitRsvp(
            $guest['id'],
            $event['id'],
            $status,
            $companions,
            $companionNames ?: null,
            $restrictions ?: null,
            $message ?: null
        );

        $this->guestModel->updateRsvpStatus($guest['id'], $status);

        $this->view('invitation/rsvp_thanks', [
            'title' => 'Gracias',
            'event' => $event,
            'guest' => $guest,
            'status' => $status,
        ], 'main');
    }
}
