<?php

class UploadController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function eventImage(): void
    {
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            jsonResponse(['error' => 'No se recibió ningún archivo.'], 400);
        }

        $file = $_FILES['image'];

        if ($file['size'] > UPLOAD_MAX_SIZE) {
            jsonResponse(['error' => 'El archivo es demasiado grande (máx 5MB).'], 400);
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, ALLOWED_IMAGE_TYPES)) {
            jsonResponse(['error' => 'Tipo de archivo no permitido.'], 400);
        }

        $ext = match ($mimeType) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
            default => 'jpg',
        };

        $filename = uuid_v4() . '.' . $ext;
        $uploadDir = __DIR__ . '/../public/uploads/events/';

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $destination = $uploadDir . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            jsonResponse(['error' => 'Error al guardar el archivo.'], 500);
        }

        jsonResponse([
            'success' => true,
            'url' => url('public/uploads/events/' . $filename),
            'filename' => $filename,
        ]);
    }
}
