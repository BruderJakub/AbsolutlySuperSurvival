const path = require('path');
// requiring the sqlite3 module
const sqlite3 = require('sqlite3');

// creating a database file
const db = new sqlite3.Database(path.join(__dirname, 'db.sqlite'), (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Database opened successfully');
    }
});

db.serialize(() => {
    db.run('PRAGMA foreign_keys = ON');

    // Reset development data before recreating the schema.
    db.run('DROP TABLE IF EXISTS profile_stage');
    db.run('DROP TABLE IF EXISTS stage_enemy');
    db.run('DROP TABLE IF EXISTS enemy_type');
    db.run('DROP TABLE IF EXISTS enemies');
    db.run('DROP TABLE IF EXISTS profile_character');
    db.run('DROP TABLE IF EXISTS character');
    db.run('DROP TABLE IF EXISTS stage');
    db.run('DROP TABLE IF EXISTS profile');

    // PROFILE

    db.run(
        'CREATE TABLE IF NOT EXISTS profile (' +
        'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
        'slot INTEGER NOT NULL UNIQUE CHECK (slot BETWEEN 1 AND 3), ' +
        'name TEXT NOT NULL, ' +
        'level INTEGER NOT NULL, ' +
        'money INTEGER NOT NULL' +
        ')'
    );

    // CHARACTER

    db.run(
        'CREATE TABLE IF NOT EXISTS character (' +
        'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
        'picture TEXT NOT NULL, ' +
        'name TEXT NOT NULL' +
        ')'
    );

    db.run(
        'CREATE TABLE IF NOT EXISTS profile_character (' +
        'character_id INTEGER NOT NULL, ' +
        'profile_id INTEGER NOT NULL, ' +
        'unlocked INTEGER NOT NULL, ' +
        'level INTEGER NOT NULL, ' +
        'PRIMARY KEY (character_id, profile_id), ' +
        'FOREIGN KEY (character_id) REFERENCES character(id), ' +
        'FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE' +
        ')'
    );

    // STAGE

    // STAGES

    db.run(
        'CREATE TABLE IF NOT EXISTS stage (' +
        'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
        'stage_number INTEGER NOT NULL UNIQUE, ' +
        'name TEXT NOT NULL' +
        ')'
    );

    // ENEMY TYPES

    db.run(
        'CREATE TABLE IF NOT EXISTS enemy_type (' +
        'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
        'name TEXT NOT NULL UNIQUE, ' +
        'picture TEXT NOT NULL, ' +
        'health INTEGER NOT NULL CHECK (health > 0), ' +
        'damage INTEGER NOT NULL CHECK (damage >= 0), ' +
        'defence INTEGER NOT NULL CHECK (defence >= 0)' +
        ')'
    );

    // ENEMIES IN EACH STAGE

    db.run(
        'CREATE TABLE IF NOT EXISTS stage_enemy (' +
        'stage_id INTEGER NOT NULL, ' +
        'enemy_type_id INTEGER NOT NULL, ' +
        'amount INTEGER NOT NULL CHECK (amount > 0), ' +
        'PRIMARY KEY (stage_id, enemy_type_id), ' +
        'FOREIGN KEY (stage_id) REFERENCES stage(id) ON DELETE CASCADE, ' +
        'FOREIGN KEY (enemy_type_id) REFERENCES enemy_type(id) ON DELETE CASCADE' +
        ')'
    );

    // STAGE PROGRESS PER PROFILE

    db.run(
        'CREATE TABLE IF NOT EXISTS profile_stage (' +
        'profile_id INTEGER NOT NULL, ' +
        'stage_id INTEGER NOT NULL, ' +
        'unlocked INTEGER NOT NULL DEFAULT 0 CHECK (unlocked IN (0, 1)), ' +
        'completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1)), ' +
        'PRIMARY KEY (profile_id, stage_id), ' +
        'FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE CASCADE, ' +
        'FOREIGN KEY (stage_id) REFERENCES stage(id) ON DELETE CASCADE' +
        ')'
    );


    let query;
    let values;


    // PROFILE

    query = 'INSERT INTO profile (slot, name, level, money) VALUES (?, ?, ?, ?)';

    values = [
        [1, 'example', 1, 1],
        [2, 'example2', 1, 1],
        [3, 'example3', 1, 1]
    ];

    values.forEach(value => {
        db.run(query, value);
    });


    // CHARACTER

    query = 'INSERT INTO character (picture, name) VALUES (?, ?)';

    values = [
        ['example', 'example'],
        ['example2', 'example2'],
        ['example3', 'example3'],
        ['example4', 'example4']
    ];

    values.forEach(value => {
        db.run(query, value);
    });

    db.run(
        'INSERT INTO profile_character (character_id, profile_id, unlocked, level) ' +
        'SELECT character.id, profile.id, CASE WHEN character.id = 1 THEN 1 ELSE 0 END, 1 ' +
        'FROM character CROSS JOIN profile'
    );


    // STAGES

    query = 'INSERT INTO stage (stage_number, name) VALUES (?, ?)';

    values = [
        [1, 'Forest Entrance'],
        [2, 'Dark Forest'],
        [3, 'Forest Guardian']
    ];

    values.forEach(value => {
        db.run(query, value);
    });


    // ENEMY TYPES

    query = 'INSERT INTO enemy_type (name, picture, health, damage, defence) VALUES (?, ?, ?, ?, ?)';

    values = [
        ['Slime', 'slime.png', 100, 20, 5],
        ['Skeleton', 'skeleton.png', 150, 30, 10],
        ['Forest Guardian', 'forest-guardian.png', 500, 60, 25]
    ];

    values.forEach(value => {
        db.run(query, value);
    });

    // STAGE ENEMY COMPOSITIONS

    query = 'INSERT INTO stage_enemy (stage_id, enemy_type_id, amount) VALUES (?, ?, ?)';

    values = [
        [1, 1, 5],
        [1, 2, 2],
        [2, 1, 3],
        [2, 2, 6],
        [3, 2, 4],
        [3, 3, 1]
    ];

    values.forEach(value => {
        db.run(query, value);
    });

    // Give every profile access to the first stage only.

    db.run(
        'INSERT INTO profile_stage (profile_id, stage_id, unlocked, completed) ' +
        'SELECT profile.id, stage.id, CASE WHEN stage.stage_number = 1 THEN 1 ELSE 0 END, 0 ' +
        'FROM profile CROSS JOIN stage'
    );

});

db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('Database closed successfully');
    }
});