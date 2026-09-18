DROP TABLE IF EXISTS project_category, project, category, organization CASCADE;

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organization(organization_id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date VARCHAR(100) NOT NULL
);

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE project_category (
    project_id INTEGER NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
    ('BrightFuture Builders', 'Community construction and support programs.', 'contact@brightfuture.example', 'brightfuture-logo.png'),
    ('GreenHarvest Growers', 'Community gardens and food access initiatives.', 'hello@greenharvest.example', 'greenharvest-logo.png'),
    ('UnityServe Volunteers', 'Neighbors helping neighbors through local service.', 'team@unityserve.example', 'unityserve-logo.png');

INSERT INTO project (organization_id, title, description, location, date)
VALUES
    (1, 'Community Center Repair', 'Repair and refresh shared community spaces.', 'Eastside', 'Every Saturday'),
    (1, 'Accessible Ramp Build', 'Build safer access ramps for neighborhood facilities.', 'North Hills', 'June 15'),
    (1, 'Youth Workshop Setup', 'Prepare a hands-on workshop space for local students.', 'Downtown', 'June 22'),
    (1, 'Neighborhood Painting Day', 'Paint public areas that need a fresh finish.', 'West End', 'June 29'),
    (1, 'Tool Lending Library', 'Organize tools and supplies for community use.', 'Eastside', 'July 6'),
    (2, 'Park Cleanup', 'Restore trails and gathering areas in a local park.', 'Riverside', 'Every Saturday'),
    (2, 'Community Garden Planting', 'Plant seasonal produce for neighborhood families.', 'Greenway', 'June 15'),
    (2, 'Food Pantry Harvest', 'Harvest and sort fresh food for a community pantry.', 'Downtown', 'June 22'),
    (2, 'Pollinator Garden Care', 'Maintain native plants that support local pollinators.', 'Riverside', 'June 29'),
    (2, 'Compost Education Day', 'Teach residents practical composting methods.', 'Greenway', 'July 6'),
    (3, 'Food Drive', 'Collect and package shelf-stable food donations.', 'Downtown', 'Every Saturday'),
    (3, 'Community Tutoring', 'Support students with reading and math practice.', 'Eastside', 'June 15'),
    (3, 'Wellness Walk', 'Bring neighbors together for an accessible group walk.', 'Central Park', 'June 22'),
    (3, 'Senior Check-In Network', 'Connect volunteers with older neighbors for regular check-ins.', 'North Hills', 'June 29'),
    (3, 'Neighborhood Resource Fair', 'Share local services and practical support resources.', 'Downtown', 'July 6');

INSERT INTO category (name)
VALUES ('Environment'), ('Community Service'), ('Education'), ('Health and Wellness');

INSERT INTO project_category (project_id, category_id)
VALUES
    (1, 2), (2, 2), (3, 3), (4, 2), (5, 2),
    (6, 1), (7, 1), (8, 2), (9, 1), (10, 3),
    (11, 2), (12, 3), (13, 4), (14, 4), (15, 2);
