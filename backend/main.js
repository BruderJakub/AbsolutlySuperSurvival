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


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});