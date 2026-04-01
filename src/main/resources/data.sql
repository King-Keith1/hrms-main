-- Departments
INSERT INTO departments (name) VALUES ('Human Resources') ON CONFLICT (name) DO NOTHING;
INSERT INTO departments (name) VALUES ('Information Technology') ON CONFLICT (name) DO NOTHING;
INSERT INTO departments (name) VALUES ('Finance') ON CONFLICT (name) DO NOTHING;
INSERT INTO departments (name) VALUES ('Operations') ON CONFLICT (name) DO NOTHING;
INSERT INTO departments (name) VALUES ('Marketing') ON CONFLICT (name) DO NOTHING;
INSERT INTO departments (name) VALUES ('Legal') ON CONFLICT (name) DO NOTHING;