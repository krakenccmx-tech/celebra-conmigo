<?php

class HomeController extends Controller
{
    public function index(): void
    {
        $this->view('home/index', ['title' => 'Celebra Conmigo - Invitaciones Digitales']);
    }
}
