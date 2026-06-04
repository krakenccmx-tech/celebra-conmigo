-- ============================================
-- Celebra Conmigo - Seed Data
-- MySQL 8.0+ | InnoDB | utf8mb4
-- ============================================

-- ----------------------------
-- Superadmin User
-- ----------------------------
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `plan`, `email_verified_at`, `created_at`, `updated_at`)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Admin',
  'admin@celebraconmigo.com',
  '$2y$12$LK4MBxGFgSAqGwCqfOvJxuqX6lG0R7rWxqHgQ8rDqKzPvVbNYJxZO',
  'superadmin',
  'Premium',
  NOW(),
  NOW(),
  NOW()
);

-- ----------------------------
-- Plans
-- ----------------------------
INSERT INTO `plans` (`id`, `name`, `price`, `features`, `limits_json`, `created_at`)
VALUES
(
  'plan-0001-0000-0000-000000000001',
  'Starter',
  0.00,
  '1 evento, 50 invitados, plantillas básicas, enlace público',
  '{"max_events": 1, "max_guests": 50, "premium_templates": false}',
  NOW()
),
(
  'plan-0002-0000-0000-000000000002',
  'Pro',
  9.99,
  '5 eventos, 200 invitados, todas las plantillas, galería de fotos, mesa de regalos',
  '{"max_events": 5, "max_guests": 200, "premium_templates": true}',
  NOW()
),
(
  'plan-0003-0000-0000-000000000003',
  'Premium',
  24.99,
  'Eventos ilimitados, invitados ilimitados, todas las plantillas, galería, regalos, check-in QR, soporte prioritario',
  '{"max_events": -1, "max_guests": -1, "premium_templates": true}',
  NOW()
);

-- ----------------------------
-- Sample Templates
-- ----------------------------
INSERT INTO `templates` (`id`, `name`, `category`, `preview_url`, `config_json`, `is_premium`, `created_at`)
VALUES
(
  'tmpl-0001-0000-0000-000000000001',
  'Elegante Clásico',
  'wedding',
  '/templates/elegante-clasico/preview.png',
  '{"font": "Playfair Display", "palette": ["#1a1a2e", "#e6d5b8", "#f5f5f5"], "layout": "centered"}',
  0,
  NOW()
),
(
  'tmpl-0002-0000-0000-000000000002',
  'Fiesta Moderna',
  'party',
  '/templates/fiesta-moderna/preview.png',
  '{"font": "Inter", "palette": ["#ff6b6b", "#feca57", "#48dbfb"], "layout": "dynamic"}',
  0,
  NOW()
);
