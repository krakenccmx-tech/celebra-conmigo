<?php

declare(strict_types=1);

class Validator
{
    private array $data;
    private array $errors = [];

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function validate(array $rules): bool
    {
        foreach ($rules as $field => $ruleSet) {
            $fieldRules = is_array($ruleSet) ? $ruleSet : explode('|', $ruleSet);
            $value = $this->data[$field] ?? null;

            foreach ($fieldRules as $rule) {
                $params = [];
                if (str_contains($rule, ':')) {
                    [$rule, $paramStr] = explode(':', $rule, 2);
                    $params = explode(',', $paramStr);
                }
                $this->applyRule($field, $value, $rule, $params);
            }
        }
        return empty($this->errors);
    }

    private function applyRule(string $field, mixed $value, string $rule, array $params): void
    {
        match ($rule) {
            'required' => $this->ruleRequired($field, $value),
            'email' => $this->ruleEmail($field, $value),
            'min' => $this->ruleMin($field, $value, (int) $params[0]),
            'max' => $this->ruleMax($field, $value, (int) $params[0]),
            'matches' => $this->ruleMatches($field, $value, $params[0]),
            'unique' => $this->ruleUnique($field, $value, $params[0], $params[1] ?? $field),
            default => null,
        };
    }

    private function ruleRequired(string $field, mixed $value): void
    {
        if ($value === null || trim((string) $value) === '') {
            $this->errors[$field][] = "El campo {$field} es obligatorio.";
        }
    }

    private function ruleEmail(string $field, mixed $value): void
    {
        if ($value && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
            $this->errors[$field][] = "El email no es válido.";
        }
    }

    private function ruleMin(string $field, mixed $value, int $min): void
    {
        if ($value && strlen((string) $value) < $min) {
            $this->errors[$field][] = "El campo {$field} debe tener al menos {$min} caracteres.";
        }
    }

    private function ruleMax(string $field, mixed $value, int $max): void
    {
        if ($value && strlen((string) $value) > $max) {
            $this->errors[$field][] = "El campo {$field} no puede superar los {$max} caracteres.";
        }
    }

    private function ruleMatches(string $field, mixed $value, string $otherField): void
    {
        if ($value !== ($this->data[$otherField] ?? null)) {
            $this->errors[$field][] = "Los campos no coinciden.";
        }
    }

    private function ruleUnique(string $field, mixed $value, string $table, string $column): void
    {
        if (!$value) return;
        $db = Database::getInstance();
        $stmt = $db->prepare("SELECT COUNT(*) FROM {$table} WHERE {$column} = :val");
        $stmt->execute(['val' => $value]);
        if ((int) $stmt->fetchColumn() > 0) {
            $this->errors[$field][] = "Este valor ya está en uso.";
        }
    }

    public function errors(): array
    {
        return $this->errors;
    }

    public function first(string $field): ?string
    {
        return $this->errors[$field][0] ?? null;
    }

    public function hasErrors(): bool
    {
        return !empty($this->errors);
    }
}
