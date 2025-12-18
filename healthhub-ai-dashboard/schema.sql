-- MariaDB Schema for HealthHub AI Dashboard

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Users Table
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL DEFAULT '1234', -- Added password column directly
    `name` VARCHAR(100) NOT NULL,
    `height` FLOAT NOT NULL, -- cm
    `target_weight` FLOAT NOT NULL, -- kg
    `goal` VARCHAR(50) NOT NULL COMMENT 'HealthGoal enum',
    `age` INT NOT NULL,
    `gender` ENUM('남', '여') NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Weight Records Table
DROP TABLE IF EXISTS `weight_records`;
CREATE TABLE `weight_records` (
    `id` VARCHAR(36) PRIMARY KEY, -- Using string ID from frontend
    `user_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `weight` FLOAT NOT NULL,
    `height` FLOAT, -- Optional in record, but good for history
    `bmi` FLOAT NOT NULL,
    `memo` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Workout Records Table
DROP TABLE IF EXISTS `workout_records`;
CREATE TABLE `workout_records` (
    `id` VARCHAR(36) PRIMARY KEY, -- Using string ID from frontend
    `user_id` INT NOT NULL,
    `date` DATETIME NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `type` VARCHAR(100) NOT NULL,
    `intensity` ENUM('낮음', '보통', '높음') NOT NULL,
    `duration` INT NOT NULL, -- minutes
    `met` FLOAT NOT NULL,
    `calories` FLOAT NOT NULL,
    `completed` BOOLEAN DEFAULT FALSE,
    `title` VARCHAR(255) NOT NULL,
    `memo` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Health Metrics Table
DROP TABLE IF EXISTS `health_metrics`;
CREATE TABLE `health_metrics` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `systolic` INT NOT NULL,
    `diastolic` INT NOT NULL,
    `blood_sugar` INT NOT NULL,
    `sleep_hours` FLOAT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- Sample Data Insertion (3 records per table)
-- ==========================================

-- Users
INSERT INTO `users` (`email`, `password`, `name`, `height`, `target_weight`, `goal`, `age`, `gender`) VALUES
('user1@example.com', '1234', '김철수', 175.5, 70.0, '다이어트', 30, '남'),
('user2@example.com', '1234', '이영희', 162.0, 52.0, '건강유지', 28, '여'),
('user3@example.com', '1234', '박민수', 180.0, 85.0, '체중증량', 25, '남');

-- Weight Records (Assuming user IDs 1, 2, 3)
INSERT INTO `weight_records` (`id`, `user_id`, `date`, `weight`, `height`, `bmi`, `memo`) VALUES
('w1', 1, '2024-03-01', 75.0, 175.5, 24.35, '시작 체중'),
('w2', 1, '2024-03-08', 74.2, 175.5, 24.09, '1주차 점검'),
('w3', 2, '2024-03-05', 54.0, 162.0, 20.58, '가벼운 느낌');

-- Workout Records
INSERT INTO `workout_records` (`id`, `user_id`, `date`, `category`, `type`, `intensity`, `duration`, `met`, `calories`, `completed`, `title`, `memo`) VALUES
('wk1', 1, '2024-03-01 18:00:00', '유산소', '달리기', '높음', 30, 9.8, 300.5, TRUE, '저녁 러닝', '컨디션 좋음'),
('wk2', 1, '2024-03-03 19:00:00', '근력', '스쿼트', '보통', 45, 5.0, 200.0, TRUE, '하체 운동', '무릎 조심'),
('wk3', 2, '2024-03-02 07:00:00', '유연성', '요가', '낮음', 60, 2.5, 150.0, TRUE, '아침 요가', '개운함');

-- Health Metrics
INSERT INTO `health_metrics` (`user_id`, `date`, `systolic`, `diastolic`, `blood_sugar`, `sleep_hours`) VALUES
(1, '2024-03-01', 120, 80, 95, 7.5),
(1, '2024-03-02', 118, 78, 92, 8.0),
(2, '2024-03-01', 110, 70, 88, 6.5);
