-- DevOps AI Agent Database Schema

-- Tabla para almacenar logs de errores
CREATE TABLE error_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    service_name VARCHAR(100) NOT NULL,
    error_level VARCHAR(20) NOT NULL, -- ERROR, WARN, FATAL
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    user_agent TEXT,
    ip_address INET,
    raw_log TEXT NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para clasificaciones de IA
CREATE TABLE ai_classifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    error_log_id UUID REFERENCES error_logs(id),
    category VARCHAR(100) NOT NULL, -- DATABASE, NETWORK, AUTH, etc.
    severity_score INTEGER CHECK (severity_score >= 1 AND severity_score <= 10),
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    suggested_solution TEXT,
    similar_issues_count INTEGER DEFAULT 0,
    ai_model_used VARCHAR(50) DEFAULT 'gpt-4',
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para reportes generados
CREATE TABLE incident_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    summary TEXT NOT NULL,
    affected_services TEXT[],
    error_count INTEGER NOT NULL,
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN', -- OPEN, IN_PROGRESS, RESOLVED
    report_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX idx_error_logs_timestamp ON error_logs(timestamp);
CREATE INDEX idx_error_logs_service ON error_logs(service_name);
CREATE INDEX idx_error_logs_level ON error_logs(error_level);
CREATE INDEX idx_ai_classifications_category ON ai_classifications(category);
CREATE INDEX idx_incident_reports_status ON incident_reports(status);