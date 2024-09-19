const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;

// Set up MySQL connection
const connection = mysql.createConnection({
    host: 'counter.mysql.database.azure.com',
    user: 'attilamusinsky@your-server',
    password: '1aCounter!',
    database: 'counter',
    ssl: {
        ca: fs.readFileSync('path/to/server-ca.pem'),
        key: fs.readFileSync('path/to/client-key.pem'),
        cert: fs.readFileSync('path/to/client-cert.pem')
    }
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get hit count
app.get('/api/hit-counter', (req, res) => {
    connection.query('SELECT hit_count FROM PageHits LIMIT 1', (error, results) => {
        if (error) throw error;

        let hitCount = results[0].hit_count;
        hitCount++;

        connection.query('UPDATE PageHits SET hit_count = ?', [hitCount], (err) => {
            if (err) throw err;
            res.json({ hit_count: hitCount });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});