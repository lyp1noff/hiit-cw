-- Up
CREATE TABLE exercise (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE workout (
    uuid CHAR(36) NOT NULL,
    name CHAR(36) NOT NULL,
    data TEXT NOT NULL,
    description TEXT,
    image_url TEXT
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
        'This is simply a period of recovery between exercises or sets. It''s important to take rest breaks to allow your body to recover and replenish energy.'
    ),
    (
        'Push-up',
        'Start in a plank position with your hands slightly wider than shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up to the starting position, keeping your body in a straight line throughout the movement.'
    ),
    (
        'Burpee',
        'Begin in a standing position, then squat down and place your hands on the floor in front of you. Jump your feet back into a plank position, perform a push-up, then jump your feet back towards your hands. Finally, explode upwards into a jump, reaching your arms overhead'
    ),
    (
        'Mountain climber',
        'Start in a plank position with your hands directly under your shoulders. Bring one knee towards your chest, then quickly switch legs, bringing the other knee towards your chest. Continue alternating legs at a fast pace, as if you''re climbing a mountain.'
    ),
    (
        'Jumping jack',
        'Start standing with your feet together and your arms at your sides. Jump your feet out to the sides while simultaneously raising your arms above your head. Then, jump back to the starting position.'
    ),
    (
        'Kettlebell swing',
        'Stand with your feet shoulder-width apart and hold a kettlebell with both hands in front of your body. Hinge at your hips and bend your knees slightly, then swing the kettlebell back between your legs. Explosively drive your hips forward and swing the kettlebell up to chest level, keeping your arms straight. Control the swing as it lowers back down between your legs and repeat.'
    );

INSERT INTO
    workout (uuid, name, data, description, image_url)
VALUES
    (
        '889efe60-6fff-455c-af40-c117fdf16b78',
        'Explosive Power Blast',
        '[{"id":"3","time":30},{"id":"1","time":30},{"id":"3","time":30},{"id":"1","time":30},{"id":"3","time":30},{"id":"1","time":60},{"id":"2","time":40},{"id":"1","time":20},{"id":"2","time":40},{"id":"1","time":20},{"id":"2","time":40},{"id":"1","time":60},{"id":"4","time":45},{"id":"1","time":15},{"id":"4","time":45},{"id":"1","time":15},{"id":"4","time":45},{"id":"1","time":60}]',
        'This high-intensity interval training (HIIT) session focuses on explosive movements to maximize power and cardiovascular endurance.',
        '../img/workouts/1.webp'
    ),
    (
        'a7a86c54-9caa-4877-bf56-07a7d41a898e',
        'Cardio Inferno',
        '[{"id":"5","time":45},{"id":"1","time":15},{"id":"5","time":45},{"id":"1","time":15},{"id":"5","time":45},{"id":"1","time":60},{"id":"3","time":60},{"id":"1","time":30},{"id":"3","time":60},{"id":"1","time":30},{"id":"3","time":60},{"id":"1","time":60},{"id":"6","time":40},{"id":"1","time":20},{"id":"6","time":40},{"id":"1","time":20},{"id":"6","time":40},{"id":"1","time":60}]',
        'This HIIT session is designed to ignite your cardiovascular system, torch calories, and improve endurance.',
        '../img/workouts/2.webp'
    ),
    (
        'b1e6df44-fd41-46c6-94a2-9b7a5bd9e9d0',
        'Full Body Blitz',
        '[{"id":"2","time":30},{"id":"1","time":30},{"id":"2","time":30},{"id":"1","time":30},{"id":"2","time":30},{"id":"1","time":60},{"id":"4","time":40},{"id":"1","time":20},{"id":"4","time":40},{"id":"1","time":20},{"id":"4","time":40},{"id":"1","time":60},{"id":"6","time":45},{"id":"1","time":15},{"id":"6","time":45},{"id":"1","time":15},{"id":"6","time":45},{"id":"1","time":60}]',
        'This HIIT routine integrates a variety of exercises to challenge multiple muscle groups and elevate heart rate for maximum calorie burn.',
        '../img/workouts/3.webp'
    );

-- Down
DROP TABLE exercise;

DROP TABLE workout;

DROP TABLE user;
