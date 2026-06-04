<?php

class Guest extends Model
{
    protected string $table = 'guests';
    protected array $fillable = ['event_id', 'name', 'email', 'phone', 'max_companions', 'token', 'rsvp_status', 'checked_in', 'checked_in_at'];

    public function findByEventId(string $eventId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE event_id = :event_id ORDER BY created_at DESC");
        $stmt->execute(['event_id' => $eventId]);
        return $stmt->fetchAll();
    }

    public function findByToken(string $token): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE token = :token LIMIT 1");
        $stmt->execute(['token' => $token]);
        return $stmt->fetch() ?: null;
    }

    public function countByEvent(string $eventId): int
    {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM {$this->table} WHERE event_id = :event_id");
        $stmt->execute(['event_id' => $eventId]);
        return (int) $stmt->fetchColumn();
    }

    public function updateRsvpStatus(string $id, string $status): bool
    {
        return $this->update($id, ['rsvp_status' => $status]);
    }

    public function generateUniqueToken(): string
    {
        do {
            $token = bin2hex(random_bytes(16));
            $stmt = $this->db->prepare("SELECT COUNT(*) FROM {$this->table} WHERE token = :token");
            $stmt->execute(['token' => $token]);
        } while ((int) $stmt->fetchColumn() > 0);
        return $token;
    }

    public function getStatsByEvent(string $eventId): array
    {
        $stmt = $this->db->prepare("
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN rsvp_status = 'confirmado' THEN 1 ELSE 0 END) as confirmed,
                SUM(CASE WHEN rsvp_status = 'cancelado' THEN 1 ELSE 0 END) as cancelled,
                SUM(CASE WHEN rsvp_status = 'pendiente' THEN 1 ELSE 0 END) as pending
            FROM {$this->table} WHERE event_id = :event_id
        ");
        $stmt->execute(['event_id' => $eventId]);
        return $stmt->fetch();
    }
}
