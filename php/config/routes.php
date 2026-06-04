<?php

return [
    'GET /'                                        => ['HomeController', 'index'],
    'GET /login'                                   => ['AuthController', 'showLogin'],
    'POST /login'                                  => ['AuthController', 'login'],
    'GET /register'                                => ['AuthController', 'showRegister'],
    'POST /register'                               => ['AuthController', 'register'],
    'POST /logout'                                 => ['AuthController', 'logout'],

    'GET /e/{slug}'                                => ['InvitationController', 'show'],
    'GET /e/{slug}/rsvp/{token}'                   => ['RsvpController', 'showForm'],
    'POST /e/{slug}/rsvp/{token}'                  => ['RsvpController', 'submit'],

    'GET /dashboard'                               => ['DashboardController', 'index'],
    'GET /dashboard/events'                        => ['EventController', 'index'],
    'GET /dashboard/events/create'                 => ['EventController', 'create'],
    'POST /dashboard/events/create'                => ['EventController', 'store'],
    'GET /dashboard/events/{id}'                   => ['EventController', 'show'],
    'GET /dashboard/events/{id}/edit'              => ['EventController', 'edit'],
    'POST /dashboard/events/{id}/edit'             => ['EventController', 'update'],
    'POST /dashboard/events/{id}/delete'           => ['EventController', 'delete'],
    'POST /dashboard/events/{id}/publish'          => ['EventController', 'publish'],
    'POST /dashboard/events/{id}/unpublish'        => ['EventController', 'unpublish'],
    'GET /dashboard/events/{id}/guests'            => ['GuestController', 'index'],
    'POST /dashboard/events/{id}/guests'           => ['GuestController', 'store'],
    'POST /dashboard/events/{id}/guests/{gid}/delete' => ['GuestController', 'delete'],

    'POST /upload/event-image'                     => ['UploadController', 'eventImage'],

    'GET /admin'                                   => ['AdminController', 'index'],
    'GET /admin/users'                             => ['AdminController', 'users'],
    'GET /admin/events'                            => ['AdminController', 'events'],
    'POST /admin/users/{id}/toggle'                => ['AdminController', 'toggleUser'],
];
