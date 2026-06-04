<?php

declare(strict_types=1);

abstract class Model
{
    protected \PDO $db;
    protected string $table = '';
    protected string $primaryKey = 'id';
    protected array $fillable = [];

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findById(string $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE {$this->primaryKey} = :id LIMIT 1");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch() ?: null;
    }

    public function findAll(array $conditions = [], string $orderBy = 'created_at DESC', ?int $limit = null): array
    {
        $sql = "SELECT * FROM {$this->table}";
        $params = [];

        if ($conditions) {
            $clauses = [];
            foreach ($conditions as $col => $val) {
                $clauses[] = "{$col} = :{$col}";
                $params[$col] = $val;
            }
            $sql .= ' WHERE ' . implode(' AND ', $clauses);
        }

        $sql .= " ORDER BY {$orderBy}";
        if ($limit) {
            $sql .= " LIMIT {$limit}";
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function create(array $data): string
    {
        $id = uuid_v4();
        $data[$this->primaryKey] = $id;
        $filtered = array_intersect_key($data, array_flip(array_merge($this->fillable, [$this->primaryKey])));

        $columns = implode(', ', array_keys($filtered));
        $placeholders = implode(', ', array_map(fn($k) => ":{$k}", array_keys($filtered)));

        $stmt = $this->db->prepare("INSERT INTO {$this->table} ({$columns}) VALUES ({$placeholders})");
        $stmt->execute($filtered);
        return $id;
    }

    public function update(string $id, array $data): bool
    {
        $filtered = array_intersect_key($data, array_flip($this->fillable));
        if (empty($filtered)) {
            return false;
        }

        $setClauses = implode(', ', array_map(fn($k) => "{$k} = :{$k}", array_keys($filtered)));
        $filtered['id'] = $id;

        $stmt = $this->db->prepare("UPDATE {$this->table} SET {$setClauses} WHERE {$this->primaryKey} = :id");
        return $stmt->execute($filtered);
    }

    public function delete(string $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE {$this->primaryKey} = :id");
        return $stmt->execute(['id' => $id]);
    }

    public function count(array $conditions = []): int
    {
        $sql = "SELECT COUNT(*) FROM {$this->table}";
        $params = [];

        if ($conditions) {
            $clauses = [];
            foreach ($conditions as $col => $val) {
                $clauses[] = "{$col} = :{$col}";
                $params[$col] = $val;
            }
            $sql .= ' WHERE ' . implode(' AND ', $clauses);
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    protected function query(string $sql, array $params = []): array
    {
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
}
