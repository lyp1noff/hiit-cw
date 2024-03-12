-- Up

CREATE TABLE exercises
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        CHAR(36) NOT NULL,
    description TEXT     NOT NULL
);

CREATE TABLE workouts
(
    uuid CHAR(36) NOT NULL,
    name CHAR(36) NOT NULL,
    data text     NOT NULL
);

CREATE TABLE users
(
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      CHAR(36) NOT NULL,
    email     CHAR(36) NOT NULL,
    google_id CHAR(36)
);

INSERT INTO exercises (name, description)
VALUES ('Push-up',
        'Push-ups are a great exercise for building upper body strength, particularly in the chest, shoulders, and triceps.'),
       ('Burpee',
        'Burpees are a full-body exercise that targets multiple muscle groups, including the chest, shoulders, arms, quads, glutes, and core.'),
       ('Mountain climber',
        'Mountain climbers are a dynamic exercise that targets multiple muscle groups, including the core, shoulders, and legs, while also improving cardiovascular fitness.'),
       ('Jumping jack',
        'Jumping jacks are a simple yet effective cardiovascular exercise that engages the entire body and increases heart rate.'),
       ('Kettlebell swing',
        'Kettlebell swings are a powerful exercise that targets the posterior chain, including the glutes, hamstrings, and lower back, while also improving grip strength and cardiovascular endurance.');

-- Down

DROP TABLE exercises;
DROP TABLE workouts;
DROP TABLE users;
