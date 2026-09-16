CREATE TABLE IF NOT EXISTS organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO organization (name)
VALUES
    ('BrightFuture Builders'),
    ('GreenHarvest Growers'),
    ('UnityServe Volunteers')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS project (
    project_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    organization_id INTEGER REFERENCES organization(organization_id) ON DELETE SET NULL
);

ALTER TABLE project
ADD COLUMN IF NOT EXISTS organization_id INTEGER;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'project_organization_id_fkey'
    ) THEN
        ALTER TABLE project
        ADD CONSTRAINT project_organization_id_fkey
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE SET NULL;
    END IF;
END $$;

INSERT INTO project (name, organization_id)
VALUES
    ('Park Cleanup', (SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers')),
    ('Food Drive', (SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers')),
    ('Community Tutoring', (SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders')),
    ('Wellness Walk', (SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'))
ON CONFLICT (name) DO UPDATE SET organization_id = EXCLUDED.organization_id;

CREATE TABLE IF NOT EXISTS category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);

INSERT INTO category (name)
VALUES
    ('Environment'),
    ('Community Service'),
    ('Education'),
    ('Health and Wellness')
ON CONFLICT (name) DO NOTHING;

INSERT INTO project_category (project_id, category_id)
SELECT project.project_id, category.category_id
FROM project
JOIN category ON category.name = CASE project.name
    WHEN 'Park Cleanup' THEN 'Environment'
    WHEN 'Food Drive' THEN 'Community Service'
    WHEN 'Community Tutoring' THEN 'Education'
    WHEN 'Wellness Walk' THEN 'Health and Wellness'
END
WHERE project.name IN ('Park Cleanup', 'Food Drive', 'Community Tutoring', 'Wellness Walk')
ON CONFLICT (project_id, category_id) DO NOTHING;
