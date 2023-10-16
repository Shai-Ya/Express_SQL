# Full-Stack-Tech-Support-Project
Full Stack Tech Support Project with Express and MySQL

Create database for the project using the following SQL code:
CREATE DATABASE service;
USE service;
CREATE TABLE requests (
    req_id INT AUTO_INCREMENT PRIMARY KEY,
    product VARCHAR(255) NOT NULL,
    client VARCHAR(255) NOT NULL,
    requested_at TIMESTAMP DEFAULT NOW()
);
