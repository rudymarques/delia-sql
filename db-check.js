const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Vérifie si le dossier ./data existe, sinon le crée
if (!fs.existsSync('./data')) fs.mkdirSync('./data');

// Création ou ouverture de la base SQLite
const db = new sqlite3.Database('./data/delia.db');

// Exécution d’un mini script de test
db.serialize(() => {
  // Création d’une table simple
  db.run(`CREATE TABLE IF NOT EXISTS test_runs(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_name TEXT,
    status TEXT,
    ran_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insertion d’un enregistrement
  db.run(`INSERT INTO test_runs(test_name, status) VALUES('pipeline-smoke','SUCCESS')`);

  // Lecture et affichage des 3 derniers tests
  db.all(`SELECT id, test_name, status, ran_at FROM test_runs ORDER BY id DESC LIMIT 3`, (err, rows) => {
    if (err) { console.error(err); process.exit(1); }
    console.log('✅ Derniers tests exécutés :');
    console.table(rows);
  });
});

db.close();
