<?php

class Event extends Model
{
    protected string $table = 'events';
    protected array $fillable = ['user_id', 'title', 'slug', 'type', 'event_date', 'event_time', 'city', 'venue_name', 'venue_address', 'venue_map_url', 'cover_image', 'description', 'status', 'template_id', 'max_guests'];

    public function findBySlug(string $slug): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE slug = :slug LIMIT 1");
        $stmt->execute(['slug' => $slug]);
        return $stmt->fetch() ?: null;
    }

    public function findByUserId(string $userId, ?string $status = null): array
    {
        $sql = "SELECT * FROM {$this->table} WHERE user_id = :user_id";
        $params = ['user_id' => $userId];
        if ($status) {
            $sql .= " AND status = :status";
            $params['status'] = $status;
        }
        $sql .= " ORDER BY event_date DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function countByUserId(string $userId): int
    {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM {$this->table} WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $userId]);
        return (int) $stmt->fetchColumn();
    }

    public function slugExists(string $slug, ?string $excludeId = null): bool
    {
        $sql = "SELECT COUNT(*) FROM {$this->table} WHERE slug = :slug";
        $params = ['slug' => $slug];
        if ($excludeId) {
            $sql .= " AND id != :id";
            $params['id'] = $excludeId;
        }
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return (int) $stmt->fetchColumn() > 0;
    }

    public function publish(string $id): bool
    {
        return $this->update($id, ['status' => 'published']);
    }

    public function unpublish(string $id): bool
    {
        return $this->update($id, ['status' => 'draft']);
    }

    public function getStats(string $eventId): array
    {
        $stmt = $this->db->prepare("
            SELECT
                COUNT(*) as total_guests,
                SUM(CASE WHEN rsvp_status = 'confirmado' THEN 1 ELSE 0 END) as confirmed,
                SUM(CASE WHEN rsvp_status = 'cancelado' THEN 1 ELSE 0 END) as cancelled,
                SUM(CASE WHEN rsvp_status = 'pendiente' THEN 1 ELSE 0 END) as pending
            FROM guests WHERE event_id = :event_id
        ");
        $stmt->execute(['event_id' => $eventId]);
        return $stmt->fetch();
    }
}
