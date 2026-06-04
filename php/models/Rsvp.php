<?php

class Rsvp extends Model
{
    protected string $table = 'rsvps';
    protected array $fillable = ['guest_id', 'event_id', 'status', 'companions_count', 'companions_names', 'food_restrictions', 'message'];

    public function findByGuestId(string $guestId): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE guest_id = :guest_id LIMIT 1");
        $stmt->execute(['guest_id' => $guestId]);
        return $stmt->fetch() ?: null;
    }

    public function getByEvent(string $eventId): array
    {
        $stmt = $this->db->prepare("
            SELECT r.*, g.name as guest_name, g.email as guest_email, g.phone as guest_phone
            FROM {$this->table} r
            JOIN guests g ON g.id = r.guest_id
            WHERE r.event_id = :event_id
            ORDER BY r.created_at DESC
        ");
        $stmt->execute(['event_id' => $eventId]);
        return $stmt->fetchAll();
    }

    public function submitRsvp(string $guestId, string $eventId, string $status, int $companions = 0, ?string $companionNames = null, ?string $restrictions = null, ?string $message = null): string
    {
        $existing = $this->findByGuestId($guestId);
        if ($existing) {
            $this->update($existing['id'], [
                'status' => $status,
                'companions_count' => $companions,
                'companions_names' => $companionNames,
                'food_restrictions' => $restrictions,
                'message' => $message,
            ]);
            return $existing['id'];
        }
        return $this->create([
            'guest_id' => $guestId,
            'event_id' => $eventId,
            'status' => $status,
            'companions_count' => $companions,
            'companions_names' => $companionNames,
            'food_restrictions' => $restrictions,
            'message' => $message,
        ]);
    }

    public function getStatsByEvent(string $eventId): array
    {
        $stmt = $this->db->prepare("
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN status = 'confirmado' THEN 1 ELSE 0 END) as confirmed,
                SUM(CASE WHEN status = 'cancelado' THEN 1 ELSE 0 END) as cancelled,
                SUM(companions_count) as total_companions
            FROM {$this->table} WHERE event_id = :event_id
        ");
        $stmt->execute(['event_id' => $eventId]);
        return $stmt->fetch();
    }
}
