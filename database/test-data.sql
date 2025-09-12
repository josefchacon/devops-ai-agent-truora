-- Datos de prueba para testing
INSERT INTO error_logs (service_name, error_level, error_message, stack_trace, raw_log) VALUES
('user-service', 'ERROR', 'Database connection timeout', 'at Connection.connect (db.js:45)', '2024-01-15 10:30:00 ERROR [user-service] Database connection timeout after 30s'),
('payment-api', 'FATAL', 'Memory leak detected', 'OutOfMemoryError at heap allocation', '2024-01-15 11:15:00 FATAL [payment-api] OutOfMemoryError: Java heap space'),
('auth-service', 'WARN', 'High response time detected', NULL, '2024-01-15 12:00:00 WARN [auth-service] Response time 5.2s exceeds threshold'),
('notification-service', 'ERROR', 'Redis connection failed', 'at RedisClient.connect (redis.js:23)', '2024-01-15 13:45:00 ERROR [notification-service] Redis connection refused on port 6379');

-- Verificar inserción
SELECT COUNT(*) as total_logs FROM error_logs;