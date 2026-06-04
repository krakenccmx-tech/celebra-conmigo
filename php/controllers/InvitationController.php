<?php

class InvitationController extends Controller
{
    private Event $eventModel;
    private Guest $guestModel;

    public function __construct()
    {
        $this->eventModel = new Event();
        $this->guestModel = new Guest();
    }

    public function show(string $slug): void
    {
        $event = $this->eventModel->findBySlug($slug);
        if (!$event || $event['status'] !== 'published') {
            $this->view('errors/404', ['title' => 'No encontrado'], 'main');
            return;
        }

        $stats = $this->guestModel->getStatsByEvent($event['id']);

        $this->view('invitation/show', [
            'title' => $event['title'],
            'event' => $event,
            'stats' => $stats,
        ], 'main');
    }
}
