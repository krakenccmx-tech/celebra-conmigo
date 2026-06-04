<?php

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(): void
    {
        $eventModel = new Event();
        $userId = Auth::id();

        $events = $eventModel->findByUserId($userId);
        $totalEvents = count($events);
        $publishedEvents = count(array_filter($events, fn($e) => $e['status'] === 'published'));

        $guestModel = new Guest();
        $totalGuests = 0;
        $confirmedGuests = 0;
        foreach ($events as $event) {
            $stats = $guestModel->getStatsByEvent($event['id']);
            $totalGuests += (int) ($stats['total'] ?? 0);
            $confirmedGuests += (int) ($stats['confirmed'] ?? 0);
        }

        $this->view('dashboard/index', [
            'title' => 'Mi Panel',
            'pageTitle' => 'Mi Panel',
            'totalEvents' => $totalEvents,
            'publishedEvents' => $publishedEvents,
            'totalGuests' => $totalGuests,
            'confirmedGuests' => $confirmedGuests,
            'recentEvents' => array_slice($events, 0, 5),
        ], 'dashboard');
    }
}
