const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '..', 'frontend')));

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

  db.all('SELECT * FROM profile ORDER BY ROWID ASC LIMIT ?', [profileID], (err, rows) => {
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});