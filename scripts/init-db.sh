#!/bin/bash
# 初始化数据库用户
# 在postgres容器启动后运行

echo "Waiting for PostgreSQL to be ready..."
sleep 5

# 使用 docker exec 运行 Python 脚本创建用户
docker exec jiajiao-postgres psql -U jiajiao -d jiajiao -c "
-- 创建管理员 (如果不存在)
INSERT INTO users (username, email, password_hash, user_type, status, created_at, updated_at)
SELECT 'admin', 'admin@jiajiao.com', '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYL0L0L0L0K', 'admin', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@jiajiao.com');

-- 创建测试家长
INSERT INTO users (username, email, password_hash, user_type, status, created_at, updated_at)
SELECT 'parent', 'parent@test.com', '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYL0L0L0L0K', 'parent', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'parent@test.com');

-- 创建测试教员
INSERT INTO users (username, email, password_hash, user_type, status, created_at, updated_at)
SELECT 'tutor', 'tutor@test.com', '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYL0L0L0L0K', 'tutor', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'tutor@test.com');
" 2>/dev/null || echo "SQL execution skipped or failed (tables may not exist yet)"

echo "Init DB completed"