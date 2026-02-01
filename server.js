const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files

// Local Development Security Middleware
const LOCAL_ADMIN_PASSWORD = "admin"; // Default local password
app.use((req, res, next) => {
    if (req.method === 'POST' && req.path === '/api/data') {
        const providedPass = req.headers['x-admin-password'];
        if (providedPass !== LOCAL_ADMIN_PASSWORD) {
            console.log("Blocked unauthorized write attempt");
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    next();
});

// Get Data
app.get('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            return res.status(500).json({ error: 'Failed to read data' });
        }
        res.json(JSON.parse(data));
    });
});

// Update Data
app.post('/api/data', (req, res) => {
    const newData = req.body;
    fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), (err) => {
        if (err) {
            console.error('Error writing data:', err);
            return res.status(500).json({ error: 'Failed to save data' });
        }
        res.json({ message: 'Data saved successfully!' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
