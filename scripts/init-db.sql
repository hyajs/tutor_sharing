-- 初始化数据库：创建管理员和测试用户
-- 密码都是 Test123456 (bcrypt hash)

-- 创建管理员 (如果不存在)
INSERT INTO users (username, email, password_hash, user_type, status, created_at, updated_at)
SELECT 'admin', 'admin@jiajiao.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYL0L0L0L0K', 'admin', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@jiajiao.com');

-- 创建测试家长 (如果不存在)
INSERT INTO users (username, email, password_hash, user_type, status, created_at, updated_at)
SELECT 'parent', 'parent@test.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYL0L0L0L0K', 'parent', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'parent@test.com');

-- 创建测试教员 (如果不存在)
INSERT INTO users (username, email, password_hash, user_type, status, created_at, updated_at)
SELECT 'tutor', 'tutor@test.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYL0L0L0L0K', 'tutor', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'tutor@test.com');
