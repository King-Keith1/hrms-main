-- Departments
INSERT INTO departments (name) VALUES ('Human Resources') ON CONFLICT (name) DO NOTHING;
INSERT INTO departments (name) VALUES ('Information Technology') ON CONFLICT (name) DO NOTHING;
INSERT INTO departments (name) VALUES ('Finance') ON CONFLICT (name) DO NOTHING;
INSERT INTO departments (name) VALUES ('Operations') ON CONFLICT (name) DO NOTHING;
INSERT INTO departments (name) VALUES ('Marketing') ON CONFLICT (name) DO NOTHING;
INSERT INTO departments (name) VALUES ('Legal') ON CONFLICT (name) DO NOTHING;

-- Demo users (password: demo123)
-- Demo users (password: password)
INSERT INTO users (username, password, role, department_id)
VALUES ('demo_admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ROLE_ADMIN', 1)
    ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, password, role, department_id)
VALUES ('demo_manager', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ROLE_MANAGER', 2)
    ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, password, role, department_id)
VALUES ('demo_employee', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ROLE_EMPLOYEE', 1)
    ON CONFLICT (username) DO NOTHING;