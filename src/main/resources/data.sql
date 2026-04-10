-- Departments
INSERT INTO departments (name) VALUES ('Human Resources') ON CONFLICT (name) DO NOTHING;
INSERT INTO departments (name) VALUES ('Information Technology') ON CONFLICT (name) DO NOTHING;
INSERT INTO departments (name) VALUES ('Finance') ON CONFLICT (name) DO NOTHING;
INSERT INTO departments (name) VALUES ('Operations') ON CONFLICT (name) DO NOTHING;
INSERT INTO departments (name) VALUES ('Marketing') ON CONFLICT (name) DO NOTHING;
INSERT INTO departments (name) VALUES ('Legal') ON CONFLICT (name) DO NOTHING;

-- Demo users (password: demo123)
INSERT INTO users (username, password, role, department_id)
VALUES ('demo_admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LKlGukSuqkO', 'ROLE_ADMIN', 1)
    ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, password, role, department_id)
VALUES ('demo_manager', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LKlGukSuqkO', 'ROLE_MANAGER', 2)
    ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, password, role, department_id)
VALUES ('demo_employee', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LKlGukSuqkO', 'ROLE_EMPLOYEE', 1)
    ON CONFLICT (username) DO NOTHING;

-- Demo employee record linked to demo_employee user
INSERT INTO employees (full_name, employee_number, department_id, hourly_rate, standard_hours_per_day, active, user_id)
VALUES ('Demo Employee', 'EMP-DEMO', 1, 50.00, 8, true,
        (SELECT id FROM users WHERE username = 'demo_employee'))
    ON CONFLICT (employee_number) DO NOTHING;