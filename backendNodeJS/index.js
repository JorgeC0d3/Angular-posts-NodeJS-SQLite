import express from 'express';
import cors from 'cors';
import db from './database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer'; //Módulo para el manejo de archivos en nodejs
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid'; // Para generar un nombre de archivo único

const port = 4000;
const app = express();
const SECRET_KEY = 'secret_key'; // Usa una clave secreta segura para JWT

app.use(express.json()); // Para parsear JSON en peticiones POST
app.use(cors()); // Para permitir que tu frontend en Angular se comunique con el backend en Node.js
app.use('/uploads', express.static('uploads')); // Servir la carpeta de imágenes

// Configurar `multer` para guardar archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const uniqueName = uuidv4() + path.extname(file.originalname); // Nombre de archivo único con la extensión original
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

/*
Middleware para verificar el token JWT
Nos aseguramos de que las solicitudes al backend estén protegidas, especialmente si manejamos usuarios autenticados 
y datos sensibles. Puedes usar jsonwebtoken para verificar el token en el backend
*/

function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];  // Extrae el token después de "Bearer"
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      req.userId = decoded.id;
      next();
    });
  }

// Registro de usuario
app.post('/api/signup', (req, res) => {
    const { username, email, password } = req.body;

    // Verifica si el usuario ya existe
    const checkUserSql = 'SELECT * FROM users WHERE username = ? and email = ?';
    db.get(checkUserSql, [username, email], (err, row) => {
        if (row) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hashea la contraseña y guarda el usuario
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) return res.status(500).json({ error: err.message });

            const insertUserSql = 'INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, ?)';
            const created_at = new Date().toISOString(); // Generar la fecha actual en formato ISO
            db.run(insertUserSql, [username, email, hashedPassword, created_at], function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ message: 'User created successfully' });
            });
        });
    });
});

// Login de usuario
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ error: 'User not found' });
        const username = user.username;

        // Verifica la contraseña
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

            // Genera un token JWT
            const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ message: 'Login successful', token, username });
        });
    });
});


// Obtener todas las publicaciones
app.get('/api/posts', (req, res) => {
    const sql = `SELECT * FROM posts ORDER BY id DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
        console.log(rows);
    });
});

// Eliminar una publicacion por su id

app.delete('/api/posts/:id', verifyToken, (req, res) => {
    // Primero, recupera el nombre de la imagen antes de eliminar el registro
    const selectImageSql = 'SELECT image FROM posts WHERE id = ?';
    const deleteSql = 'DELETE FROM posts WHERE id = ?';
    const params = [req.params.id];

    db.get(selectImageSql, params, (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!row) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const imagePath = path.join('uploads', row.image);

        // Elimina el archivo de imagen
        fs.unlink(imagePath, (err) => {
            if (err && err.code !== 'ENOENT') {
                console.error('Error deleting image:', err);
                return res.status(500).json({ error: 'Failed to delete image' });
            }

            // Después de eliminar la imagen, elimina el registro en la base de datos
            db.run(deleteSql, params, function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ message: 'Post and image deleted successfully' });
            });
        });
    });
});

// Insertar una publicacion
app.post('/api/savepost', verifyToken, upload.single('image'), (req, res) => {
 
    const { content, username } = req.body; // No recibimos 'date' desde el cliente
    const created_at = new Date().toISOString(); // Generar la fecha actual en formato ISO
    const image = req.file ? req.file.filename : null; // Guardar el nombre de la imagen

    const sql = `INSERT INTO posts (username, image, content, created_at) VALUES (?, ?, ?, ?)`;
    const params = [username, image, content, created_at];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

app.get('/', (req, res) => {
    res.send('API REST Angular-Posts-NodeJS');
});

app.listen(port, () => {
    console.log(`Server run in http://localhost:${port}`);
});