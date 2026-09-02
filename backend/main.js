const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.get('/profile', (req, res) => {
  const db = new sqlite3.Database('../db/db.sqlite', (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      res.status(500).json({ error: 'Failed to open database' });
    }
  });

  db.all("SELECT * FROM profile", (err, rows) => {
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