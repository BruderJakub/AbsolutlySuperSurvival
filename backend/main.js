const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;
const { randomInt } = require('crypto'); // For generating random int

app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(express.json());


// Function to calculate chest reward based on level

function calculateChestReward(level) {
  
  const baseReward = level * 100;
  const minimum = Math.ceil(baseReward * 0.75);
  const maximum = Math.floor(baseReward * 1.25);

  return randomInt(minimum, maximum + 1);
}

// API endpoint to get all profiles
// API get all profiles

app.get('/profile', (req, res) => {
  const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'db.sqlite'), (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      res.status(500).json({ error: 'Failed to open database' });
    }
  });

  db.all('SELECT * FROM profile', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({
        profile: rows
      });
    }
  });

  db.close();
});

// API endpoint to get a specific profile by ID

app.get('/profile/:profileID', (req, res) => {
  const { profileID } = req.params;
  const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'db.sqlite'), (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      res.status(500).json({ error: 'Failed to open database' });
    }
  });

  db.all('SELECT * FROM profile WHERE id = ?', [profileID], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({
        profile: rows
      });
    }
  });

  db.close();
});


app.get('/profile/:profileID/name', (req, res) => {
  const { profileID } = req.params;
  const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'db.sqlite'), (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      res.status(500).json({ error: 'Failed to open database' });
    }
  });

  db.all('SELECT name FROM profile WHERE id = ?', [profileID], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({
        profile: rows
      });
    }
  });

  db.close();
});

app.get('/profile/:profileID/level', (req, res) => {
  const { profileID } = req.params;
  const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'db.sqlite'), (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      res.status(500).json({ error: 'Failed to open database' });
    }
  });

  db.all('SELECT level FROM profile WHERE id = ?', [profileID], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({
        profile: rows
      });
    }
  });

  db.close();
});

app.get('/profile/:profileID/money', (req, res) => {
  const { profileID } = req.params;
  const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'db.sqlite'), (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      res.status(500).json({ error: 'Failed to open database' });
    }
  });

  db.all('SELECT money FROM profile WHERE id = ?', [profileID], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({
        profile: rows
      });
    }
  });

  db.close();
});

app.get('/character/:characterID', (req, res) => {
  const { characterID: profileID } = req.params;
  const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'db.sqlite'), (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      res.status(500).json({ error: 'Failed to open database' });
    }
  });

  db.all(
    'SELECT character.id, character.picture, character.name, ' +
    'profile_character.level, profile_character.unlocked ' +
    'FROM character ' +
    'JOIN profile_character ON profile_character.character_id = character.id ' +
    'WHERE profile_character.profile_id = ?',
    [profileID],
    (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({
        character: rows
        }
      );
    }
  });

  db.close();
});

// API patch
// API change character unlocked status

app.patch('/character/:characterID/unlock', (req, res) => {
  const { characterID } = req.params;
  const profileID = req.query.profileID || req.body.profileID;
  const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'db.sqlite'), (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      res.status(500).json({ error: 'Failed to open database' });
    }
  });

  db.run(
    'UPDATE profile_character SET unlocked = 1 WHERE character_id = ? AND profile_id = ?',
    [characterID, profileID],
    function (err) {
    if (err) {
      console.error('Error updating character:', err.message);
      res.status(500).json({ error: 'Failed to update character' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Character not found' });
    } else {
      res.json({ message: 'Character unlocked successfully' });
    }

    db.close();
    }
  );
});

// API change character level
 
app.patch('/character/:characterID/level' , (req, res) => {
    const { characterID } = req.params;
    const profileID = req.query.profileID || req.body.profileID;
    const { level } = req.body;

      if (!Number.isInteger(level) || level < 1) {
        res.status(400).json({ error: 'Level must be a positive integer' });
        return;
      }

      const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'db.sqlite'), (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
          res.status(500).json({ error: 'Failed to open database' });
        }
      });

    db.run(
      'UPDATE profile_character SET level = ? WHERE character_id = ? AND profile_id = ?',
      [level, characterID, profileID],
      function (err) {
      if (err) {
        console.error('Error updating character level:', err.message);
        res.status(500).json({ error: 'Failed to update character level' });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Character not found' });
      } else {
        res.json({ message: 'Character level updated successfully' });
      }

      db.close();
      }
    );
});

// API change profile level

app.patch('/profile/:profileID/level', (req, res) => {
  const { profileID } = req.params;
  const { level } = req.body;

  if (!Number.isInteger(level) || level < 1) {
    res.status(400).json({ error: 'Level must be a positive integer' });
    return;
  }

  const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'db.sqlite'), (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      res.status(500).json({ error: 'Failed to open database' });
    }
  });

  db.run(
    'UPDATE profile SET level = ? WHERE id = ?',
    [level, profileID],
    function (err) {
      if (err) {
        console.error('Error updating profile level:', err.message);
        res.status(500).json({ error: 'Failed to update profile level' });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Profile not found' });
      } else {
        res.json({ message: 'Profile level updated successfully' });
      }

      db.close();
    }
  );
});

// API change profile money

app.patch('/profile/:profileID/money', (req, res) => {
  const { profileID } = req.params;
  const { money } = req.body;
  if (!Number.isInteger(money) || money < 0) {
    res.status(400).json({ error: 'Money must be a non-negative integer' });
    return;
  }

  const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'db.sqlite'), (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      res.status(500).json({ error: 'Failed to open database' });
    }
  });

  db.run(
    'UPDATE profile SET money = ? WHERE id = ?',
    [money, profileID],
    function (err) {
      if (err) {
        console.error('Error updating profile money:', err.message);
        res.status(500).json({ error: 'Failed to update profile money' });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Profile not found' });
      } else {
        res.json({ message: 'Profile money updated successfully' });
      }

      db.close();
    }
  );
});

// Chest opening endpoint

app.post('/profile/:profileID/chest', (req, res) => {
  const { profileID } = req.params;
  const db = new sqlite3.Database(
    path.join(__dirname, '..', 'db', 'db.sqlite')
  );

  db.get(
    'SELECT level FROM profile WHERE id = ?',
    [profileID],
    (err, profile) => {
      if (err) {
        db.close();
        return res.status(500).json({ error: 'Failed to load profile' });
      }

      if (!profile) {
        db.close();
        return res.status(404).json({ error: 'Profile not found' });
      }

      const reward = calculateChestReward(profile.level);

      db.run(
        'UPDATE profile SET money = money + ? WHERE id = ?',
        [reward, profileID],
        function (updateError) {
          db.close();

          if (updateError) {
            return res.status(500).json({
              error: 'Failed to add chest reward'
            });
          }

          res.json({
            reward,
            message: 'Chest opened successfully'
          });
        }
      );
    }
  );
});

app.get('/stage', (req, res) => {
  const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'db.sqlite'), (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      res.status(500).json({ error: 'Failed to open database' });
    }
  });

// Fetch all stages with their enemies // Hilfe von AI da SELECTS / JOINS
/* 
     .---.
    |      \
    | () () |
     \  ^  /
      |||||
    .-" "-.
   / |   | \
  |  |   |  |

*/

  db.all(
    'SELECT stage.id AS stage_id, stage.stage_number, stage.name AS stage_name, ' +
    'enemy_type.id AS enemy_type_id, enemy_type.name AS enemy_name, ' +
    'enemy_type.picture, enemy_type.health, enemy_type.damage, enemy_type.defence, ' +
    'stage_enemy.amount ' +
    'FROM stage ' +
    'LEFT JOIN stage_enemy ON stage_enemy.stage_id = stage.id ' +
    'LEFT JOIN enemy_type ON enemy_type.id = stage_enemy.enemy_type_id ' +
    'ORDER BY stage.stage_number, enemy_type.id',
    (err, rows) => {
    if (err) {
      console.error('Error fetching stages:', err.message);
      res.status(500).json({ error: 'Failed to fetch stages' });
    } else {
      const stages = [];

      rows.forEach((row) => {
        let stage = stages.find((item) => item.id === row.stage_id);

        if (!stage) {
          stage = {
            id: row.stage_id,
            stageNumber: row.stage_number,
            name: row.stage_name,
            enemies: []
          };
          stages.push(stage);
        }

        if (row.enemy_type_id !== null) {
          stage.enemies.push({
            id: row.enemy_type_id,
            name: row.enemy_name,
            picture: row.picture,
            health: row.health,
            damage: row.damage,
            defence: row.defence,
            amount: row.amount
          });
        }
      });

      res.json(stages);
    }
    db.close();
  });
});

app.get('/stage/:stageID', (req, res) => {
  const { stageID } = req.params;
  const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'db.sqlite'), (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      res.status(500).json({ error: 'Failed to open database' });
    }
  });

// Fetch a specific stage by ID, including its enemies // Hilfe von AI da SELECTS / JOINS 
/* 
     .---.
    |      \
    | () () |
     \  ^  /
      |||||
    .-" "-.
   / |   | \
  |  |   |  |

*/

  db.all(
    'SELECT stage.id AS stage_id, stage.stage_number, stage.name AS stage_name, ' +
    'enemy_type.id AS enemy_type_id, enemy_type.name AS enemy_name, ' +
    'enemy_type.picture, enemy_type.health, enemy_type.damage, enemy_type.defence, ' +
    'stage_enemy.amount ' +
    'FROM stage ' +
    'LEFT JOIN stage_enemy ON stage_enemy.stage_id = stage.id ' +
    'LEFT JOIN enemy_type ON enemy_type.id = stage_enemy.enemy_type_id ' +
    'WHERE stage.id = ? ' +
    'ORDER BY enemy_type.id',
    [stageID],
    (err, rows) => {
    if (err) {
      console.error('Error fetching stage:', err.message);
      res.status(500).json({ error: 'Failed to fetch stage' });
    } else if (rows.length === 0) {
      res.status(404).json({ error: 'Stage not found' });
    } else {
      const stage = {
        id: rows[0].stage_id,
        stageNumber: rows[0].stage_number,
        name: rows[0].stage_name,
        enemies: []
      };

      rows.forEach((row) => {
        if (row.enemy_type_id !== null) {
          stage.enemies.push({
            id: row.enemy_type_id,
            name: row.enemy_name,
            picture: row.picture,
            health: row.health,
            damage: row.damage,
            defence: row.defence,
            amount: row.amount
          });
        }
      });

      res.json(stage);
    }
    db.close();
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});