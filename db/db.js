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

    db.run(
        'CREATE TABLE IF NOT EXISTS stage (' +
        'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
        'name TEXT NOT NULL, ' +
        'unlocked INTEGER NOT NULL, ' +
        'profile_id INTEGER NOT NULL, ' +
        'FOREIGN KEY (profile_id) REFERENCES profile(id)' +
        ')'
    );

    // ENEMIES

    db.run(
        'CREATE TABLE IF NOT EXISTS enemies (' +
        'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
        'name TEXT NOT NULL, ' +
        'health INTEGER NOT NULL, ' +
        'damage INTEGER NOT NULL, ' +
        'defence INTEGER NOT NULL, ' +
        'stage_id INTEGER NOT NULL, ' +
        'FOREIGN KEY (stage_id) REFERENCES stage(id)' +
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


    // STAGE

    query = 'INSERT INTO stage (name, unlocked, profile_id) VALUES (?, ?, ?)';

    values = [
        ['example', 1, 1],
        ['example2', 0, 1]
    ];

    values.forEach(value => {
        db.run(query, value);
    });


    // ENEMIES

    query = 'INSERT INTO enemies (name, health, damage, defence, stage_id) VALUES (?, ?, ?, ?, ?)';

    values = [
        ['example', 100, 20, 5, 1],
        ['example2', 200, 30, 10, 1]
    ];

    values.forEach(value => {
        db.run(query, value);
    });

});

db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('Database closed successfully');
    }
});