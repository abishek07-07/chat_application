CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE auth.users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    identifier UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    email VARCHAR(200) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    last_login TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE auth.roles (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255),
    abbreviation VARCHAR(20) UNIQUE NOT NULL,
    is_system BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE auth.permissions (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    module VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auth.user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES auth.roles(id) ON DELETE CASCADE
);

CREATE TABLE auth.role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES auth.roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES auth.permissions(id) ON DELETE CASCADE
);

CREATE INDEX idx_users_identifier ON auth.users(identifier);
CREATE INDEX idx_users_email ON auth.users(email);
CREATE INDEX idx_users_username ON auth.users(username);
CREATE INDEX idx_permissions_name ON auth.permissions(name);

INSERT INTO auth.roles (name, description, abbreviation, is_system)
VALUES
('Super Admin','Has every permission','SUPER_ADMIN',TRUE),
('Administrator','System administrator','ADMIN',TRUE),
('Manager','Manages users','MANAGER',TRUE),
('Employee','Normal employee','EMP',TRUE),
('User','Normal User', 'USR',TRUE);

INSERT INTO auth.permissions (name,module,action,description)
VALUES
('User.Create','User','Create','Create users'),
('User.Read','User','Read','Read users'),
('User.Update','User','Update','Update users'),
('User.Delete','User','Delete','Delete users'),
('Role.Create','Role','Create','Create roles'),
('Role.Read','Role','Read','Read roles'),
('Role.Update','Role','Update','Update roles'),
('Role.Delete','Role','Delete','Delete roles'),
('Permission.Create','Permission','Create','Create permissions'),
('Permission.Read','Permission','Read','Read permissions'),
('Permission.Update','Permission','Update','Update permissions'),
('Permission.Delete','Permission','Delete','Delete permissions');

INSERT INTO auth.users
(email, username, password, first_name, last_name, email_verified, status)
VALUES
('abishek112@gmail.com','abishek','$2a$12$AwHlDgTI3DnBU5M5w4EceOZsqqUB.VPFowwAJudzcGDNQ4gKC1FoW','Abishek','Shrestha',TRUE,'ACTIVE'),
('admin@example.com','admin','$2a$12$AwHlDgTI3DnBU5M5w4EceOZsqqUB.VPFowwAJudzcGDNQ4gKC1FoW','System','Administrator',TRUE,'ACTIVE'),
('manager@example.com','manager','$2a$12$AwHlDgTI3DnBU5M5w4EceOZsqqUB.VPFowwAJudzcGDNQ4gKC1FoW','John','Doe',TRUE,'ACTIVE'),
('employee@example.com','employee','$2a$12$AwHlDgTI3DnBU5M5w4EceOZsqqUB.VPFowwAJudzcGDNQ4gKC1FoW','Jane','Smith',TRUE,'ACTIVE'),
('guest@example.com','guest','$2a$12$AwHlDgTI3DnBU5M5w4EceOZsqqUB.VPFowwAJudzcGDNQ4gKC1FoW','Guest','User',TRUE,'ACTIVE');

INSERT INTO auth.user_roles (user_id, role_id)
VALUES
(1,1),
(2,2),
(3,3),
(4,4),
(5,5);

INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT 1, id
FROM auth.permissions;

INSERT INTO auth.role_permissions (role_id, permission_id)
VALUES
(2,1),(2,2),(2,3),(2,5),(2,6),(2,7),(2,10),(2,11),
(3,2),(3,3),(3,6),(3,10),
(4,2),(4,10),
(5,2);