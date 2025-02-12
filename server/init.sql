-- 🛑 Drop database if it exists (for reset)
DROP DATABASE IF EXISTS auth_db;

-- 🏗️ Create a new database
CREATE DATABASE auth_db;

-- 🔄 Use the database (For MySQL only)
USE auth_db;

-- 🚀 Create the `roles` table (Stores user roles)
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

-- 🚀 Create the `permissions` table (Stores actions that users can perform)
CREATE TABLE permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    permission_name VARCHAR(100) UNIQUE NOT NULL
);

-- 🚀 Create the `users` table (Stores user data)
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Store hashed password (bcrypt)
    is_active BOOLEAN DEFAULT TRUE, -- Mark account active/inactive
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 🚀 Create the `role_permissions` table (Maps roles to permissions)
CREATE TABLE role_permissions (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- 🚀 Create the `user_roles` table (Maps users to roles)
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 🚀 Create the `sessions` table (Stores login sessions for users)
CREATE TABLE sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 📝 Insert predefined roles
INSERT INTO roles (role_name) VALUES ('admin'), ('user'), ('moderator');

-- 📝 Insert predefined permissions
INSERT INTO permissions (permission_name) VALUES 
('create_post'), ('edit_post'), ('delete_post'),
('ban_user'), ('view_dashboard');

-- 📝 Assign permissions to the `admin` role
INSERT INTO role_permissions (role_id, permission_id) 
VALUES 
((SELECT id FROM roles WHERE role_name='admin'), (SELECT id FROM permissions WHERE permission_name='create_post')),
((SELECT id FROM roles WHERE role_name='admin'), (SELECT id FROM permissions WHERE permission_name='edit_post')),
((SELECT id FROM roles WHERE role_name='admin'), (SELECT id FROM permissions WHERE permission_name='delete_post')),
((SELECT id FROM roles WHERE role_name='admin'), (SELECT id FROM permissions WHERE permission_name='ban_user')),
((SELECT id FROM roles WHERE role_name='admin'), (SELECT id FROM permissions WHERE permission_name='view_dashboard'));

-- 📝 Assign limited permissions to the `user` role
INSERT INTO role_permissions (role_id, permission_id) 
VALUES 
((SELECT id FROM roles WHERE role_name='user'), (SELECT id FROM permissions WHERE permission_name='create_post')),
((SELECT id FROM roles WHERE role_name='user'), (SELECT id FROM permissions WHERE permission_name='edit_post'));

-- 📝 Insert a sample admin user (hashed password: "password123" using bcrypt)
INSERT INTO users (username, email, password_hash) 
VALUES ('admin_user', 'admin@example.com', '$2y$10$abcdef1234567890abcdefabcdefabcdefabcdefabcdefabcdef');

-- 📝 Insert a sample normal user
INSERT INTO users (username, email, password_hash) 
VALUES ('normal_user', 'user@example.com', '$2y$10$abcdef1234567890abcdefabcdefabcdefabcdefabcdefabcdef');

-- 📝 Assign the `admin` role to `admin_user`
INSERT INTO user_roles (user_id, role_id) 
VALUES ((SELECT id FROM users WHERE username='admin_user'), (SELECT id FROM roles WHERE role_name='admin'));

-- 📝 Assign the `user` role to `normal_user`
INSERT INTO user_roles (user_id, role_id) 
VALUES ((SELECT id FROM users WHERE username='normal_user'), (SELECT id FROM roles WHERE role_name='user'));

-- ✅ Verify Roles Assigned to Users
SELECT u.username, r.role_name
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id;

-- ✅ Verify Permissions for an Admin User
SELECT u.username, p.permission_name
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE u.username = 'admin_user';

-- ✅ Check if a user has a specific permission (Example: delete_post)
SELECT COUNT(*) 
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE u.username = 'admin_user' AND p.permission_name = 'delete_post';
