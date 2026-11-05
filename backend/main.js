const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(express.json());

// API endpoint to get all profiles
// API get

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
  const { characterID } = req.params;
  const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'db.sqlite'), (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      res.status(500).json({ error: 'Failed to open database' });
    }
  });

  db.all('SELECT * FROM character WHERE profile_id = ?', [characterID], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({
        character: rows
      });
    }
  });

  db.close();
});

// API patch
// API change character unlocked status

app.patch('/character/:characterID/unlock', (req, res) => {
  const { characterID } = req.params;
  const db = new sqlite3.Database(path.join(__dirname, '..', 'db', 'db.sqlite'), (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      res.status(500).json({ error: 'Failed to open database' });
    }
  });

  db.run('UPDATE character SET unlocked = 1 WHERE id = ?', [characterID], function (err) {
    if (err) {
      console.error('Error updating character:', err.message);
      res.status(500).json({ error: 'Failed to update character' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Character not found' });
    } else {
      res.json({ message: 'Character unlocked successfully' });
    }

    db.close();
  });
});

// API change character level
 
app.patch('/character/:characterID/level' , (req, res) => {
    const { characterID } = req.params;
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

    db.run('UPDATE character SET level = ? WHERE id = ?', [level, characterID], function (err) {
      if (err) {
        console.error('Error updating character level:', err.message);
        res.status(500).json({ error: 'Failed to update character level' });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Character not found' });
      } else {
        res.json({ message: 'Character level updated successfully' });
      }

      db.close();
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});