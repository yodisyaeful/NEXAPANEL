-- ============================================================
--  NexaPanel Database Schema
--  Jalankan: mysql -u root -p < database.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS nexapanel_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nexapanel_db;

-- ----------------------------------------------------------
-- TABEL USERS
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id           INT          AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL,
  role         ENUM('admin','manager','staff') DEFAULT 'staff',
  avatar       VARCHAR(255) DEFAULT NULL,
  is_active    TINYINT(1)   DEFAULT 1,
  last_login   DATETIME     DEFAULT NULL,
  created_at   DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------
-- SEED: akun default  (password = admin123)
-- ----------------------------------------------------------
INSERT IGNORE INTO users (name, email, password, role) VALUES
(
  'Administrator',
  'admin@nexapanel.com',
  '$2b$10$Nqk0cQRf7FzN/0sY8evix.Xs2vsNjAynW./kEG5dOA6SA/Tdga/FO',
  'admin'
),
(
  'Budi Santoso',
  'budi@nexapanel.com',
  '$2b$10$Nqk0cQRf7FzN/0sY8evix.Xs2vsNjAynW./kEG5dOA6SA/Tdga/FO',
  'manager'
);
