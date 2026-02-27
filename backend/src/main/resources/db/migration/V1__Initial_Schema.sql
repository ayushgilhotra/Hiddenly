-- V1__Initial_Schema.sql
-- LEARNING NOTE:
-- Flyway uses versioned migrations to manage database changes reliably.
-- This file defines our base table structure.
-- We use UUIDs for IDs in some cases, but for simplicity here we use BigSerial (auto-incrementing bigint).

-- Table for user management
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_photo VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for hidden spots
CREATE TABLE spots (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    budget_min DECIMAL(10, 2),
    budget_max DECIMAL(10, 2),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address TEXT NOT NULL,
    image_urls JSONB, -- Storing array of image URLs as JSONB for flexibility
    added_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for reviews
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    spot_id BIGINT NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    tips TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for user wishlist
CREATE TABLE wishlist (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    spot_id BIGINT NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
    UNIQUE(user_id, spot_id) -- A user can't save the same spot twice
);
