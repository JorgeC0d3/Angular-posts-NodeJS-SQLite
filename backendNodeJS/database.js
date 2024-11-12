import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./posts_angular.db', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('¡Conectado a la base de datos SQLite!');
    }
});

// Crear las tablas si no existen
//serialize() garantiza que las consultas y operaciones que se incluyan dentro del bloque se ejecuten en orden
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      email TEXT,
      password TEXT,
      created_at datetime
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        image TEXT,
        content TEXT,
        created_at datetime
      )`);
});

export default db;