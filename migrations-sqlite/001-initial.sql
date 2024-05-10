-- Up
CREATE TABLE exercise (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name CHAR(36) NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE workout (
    uuid CHAR(36) NOT NULL,
    name CHAR(36) NOT NULL,
    data text NOT NULL,
    description text,
    image_url text
);

CREATE TABLE user (
    uuid CHAR(36) NOT NULL,
    name CHAR(36),
    email CHAR(36),
    google_id CHAR(36)
);

CREATE TABLE user_to_workout (
    user_uuid CHAR(36) NOT NULL,
    workout_uuid CHAR(36) NOT NULL
);

INSERT INTO
    exercise (name, description)
VALUES
    (
        'Rest',
        'Just take a deep breath.'
    ),
    (
        'Push-up',
        'Push-ups are a great exercise for building upper body strength, particularly in the chest, shoulders, and triceps.'
    ),
    (
        'Burpee',
        'Burpees are a full-body exercise that targets multiple muscle groups, including the chest, shoulders, arms, quads, glutes, and core.'
    ),
    (
        'Mountain climber',
        'Mountain climbers are a dynamic exercise that targets multiple muscle groups, including the core, shoulders, and legs, while also improving cardiovascular fitness.'
    ),
    (
        'Jumping jack',
        'Jumping jacks are a simple yet effective cardiovascular exercise that engages the entire body and increases heart rate.'
    ),
    (
        'Kettlebell swing',
        'Kettlebell swings are a powerful exercise that targets the posterior chain, including the glutes, hamstrings, and lower back, while also improving grip strength and cardiovascular endurance.'
    );

INSERT INTO
    workout (uuid, name, data, description, image_url)
VALUES
    (
        '889efe60-6fff-455c-af40-c117fdf16b78',
        'Explosive Power Blast',
        '[{"id":"3","time":30},{"id":"1","time":30},{"id":"3","time":30},{"id":"1","time":30},{"id":"3","time":30},{"id":"1","time":60},{"id":"2","time":40},{"id":"1","time":20},{"id":"2","time":40},{"id":"1","time":20},{"id":"2","time":40},{"id":"1","time":60},{"id":"4","time":45},{"id":"1","time":15},{"id":"4","time":45},{"id":"1","time":15},{"id":"4","time":45},{"id":"1","time":60}]',
        'This high-intensity interval training (HIIT) session focuses on explosive movements to maximize power and cardiovascular endurance.',
        '../img/workouts/1.jpg'
    ),
    (
        'a7a86c54-9caa-4877-bf56-07a7d41a898e',
        'Cardio Inferno',
        '[{"id":"5","time":45},{"id":"1","time":15},{"id":"5","time":45},{"id":"1","time":15},{"id":"5","time":45},{"id":"1","time":60},{"id":"3","time":60},{"id":"1","time":30},{"id":"3","time":60},{"id":"1","time":30},{"id":"3","time":60},{"id":"1","time":60},{"id":"6","time":40},{"id":"1","time":20},{"id":"6","time":40},{"id":"1","time":20},{"id":"6","time":40},{"id":"1","time":60}]',
        'This HIIT session is designed to ignite your cardiovascular system, torch calories, and improve endurance.',
        '../img/workouts/2.jpg'
    ),
    (
        'b1e6df44-fd41-46c6-94a2-9b7a5bd9e9d0',
        'Full Body Blitz',
        '[{"id":"2","time":30},{"id":"1","time":30},{"id":"2","time":30},{"id":"1","time":30},{"id":"2","time":30},{"id":"1","time":60},{"id":"4","time":40},{"id":"1","time":20},{"id":"4","time":40},{"id":"1","time":20},{"id":"4","time":40},{"id":"1","time":60},{"id":"6","time":45},{"id":"1","time":15},{"id":"6","time":45},{"id":"1","time":15},{"id":"6","time":45},{"id":"1","time":60}]',
        'This HIIT routine integrates a variety of exercises to challenge multiple muscle groups and elevate heart rate for maximum calorie burn.',
        '../img/workouts/3.jpg'
    );

-- Down
DROP TABLE exercise;

DROP TABLE workout;

DROP TABLE user;
