CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organization(organization_id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS project_category (
    project_id INTEGER NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin', 'admin@example.com', crypt('cse340!', gen_salt('bf', 10)), 'admin')
ON CONFLICT (email) DO NOTHING;

UPDATE users
SET role = 'admin'
WHERE email = 'denelsonclerville8@gmail.com';

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
    ('BrightFuture Builders', 'Community construction and support programs.', 'contact@brightfuture.example', 'brightfuture-logo.png'),
    ('GreenHarvest Growers', 'Community gardens and food access initiatives.', 'hello@greenharvest.example', 'greenharvest-logo.png'),
    ('UnityServe Volunteers', 'Neighbors helping neighbors through local service.', 'team@unityserve.example', 'unityserve-logo.png')
ON CONFLICT (name) DO NOTHING;

INSERT INTO project (organization_id, title, description, location, date)
SELECT o.organization_id, seed.title, seed.description, seed.location, seed.date
FROM (VALUES
    ('BrightFuture Builders', 'Community Center Repair', 'Repair and refresh shared community spaces.', 'Eastside', 'Every Saturday'),
    ('BrightFuture Builders', 'Accessible Ramp Build', 'Build safer access ramps for neighborhood facilities.', 'North Hills', 'June 15'),
    ('BrightFuture Builders', 'Youth Workshop Setup', 'Prepare a hands-on workshop space for local students.', 'Downtown', 'June 22'),
    ('BrightFuture Builders', 'Neighborhood Painting Day', 'Paint public areas that need a fresh finish.', 'West End', 'June 29'),
    ('BrightFuture Builders', 'Tool Lending Library', 'Organize tools and supplies for community use.', 'Eastside', 'July 6'),
    ('GreenHarvest Growers', 'Park Cleanup', 'Restore trails and gathering areas in a local park.', 'Riverside', 'Every Saturday'),
    ('GreenHarvest Growers', 'Community Garden Planting', 'Plant seasonal produce for neighborhood families.', 'Greenway', 'June 15'),
    ('GreenHarvest Growers', 'Food Pantry Harvest', 'Harvest and sort fresh food for a community pantry.', 'Downtown', 'June 22'),
    ('GreenHarvest Growers', 'Pollinator Garden Care', 'Maintain native plants that support local pollinators.', 'Riverside', 'June 29'),
    ('GreenHarvest Growers', 'Compost Education Day', 'Teach residents practical composting methods.', 'Greenway', 'July 6'),
    ('UnityServe Volunteers', 'Food Drive', 'Collect and package shelf-stable food donations.', 'Downtown', 'Every Saturday'),
    ('UnityServe Volunteers', 'Community Tutoring', 'Support students with reading and math practice.', 'Eastside', 'June 15'),
    ('UnityServe Volunteers', 'Wellness Walk', 'Bring neighbors together for an accessible group walk.', 'Central Park', 'June 22'),
    ('UnityServe Volunteers', 'Senior Check-In Network', 'Connect volunteers with older neighbors for regular check-ins.', 'North Hills', 'June 29'),
    ('UnityServe Volunteers', 'Neighborhood Resource Fair', 'Share local services and practical support resources.', 'Downtown', 'July 6')
) AS seed(organization_name, title, description, location, date)
JOIN organization o ON o.name = seed.organization_name
WHERE NOT EXISTS (
    SELECT 1
    FROM project p
    WHERE p.organization_id = o.organization_id
      AND p.title = seed.title
);

INSERT INTO category (name)
VALUES ('Environment'), ('Community Service'), ('Education'), ('Health and Wellness')
ON CONFLICT (name) DO NOTHING;

INSERT INTO project_category (project_id, category_id)
SELECT p.project_id, c.category_id
FROM (VALUES
    ('Community Center Repair', 'Community Service'),
    ('Accessible Ramp Build', 'Community Service'),
    ('Youth Workshop Setup', 'Education'),
    ('Neighborhood Painting Day', 'Community Service'),
    ('Tool Lending Library', 'Community Service'),
    ('Park Cleanup', 'Environment'),
    ('Community Garden Planting', 'Environment'),
    ('Food Pantry Harvest', 'Community Service'),
    ('Pollinator Garden Care', 'Environment'),
    ('Compost Education Day', 'Education'),
    ('Food Drive', 'Community Service'),
    ('Community Tutoring', 'Education'),
    ('Wellness Walk', 'Health and Wellness'),
    ('Senior Check-In Network', 'Health and Wellness'),
    ('Neighborhood Resource Fair', 'Community Service')
) AS seed(project_title, category_name)
JOIN project p ON p.title = seed.project_title
JOIN category c ON c.name = seed.category_name
WHERE true
ON CONFLICT (project_id, category_id) DO NOTHING;
