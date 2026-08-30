//requiring the sqlite3 module

const sqlite3 = require('sqlite3');

// creating a database file
const db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Database opened successfully');
  }
});


db.run("")



db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message); 
    } else {
    console.log('Database closed successfully');
  }
});
