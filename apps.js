// Import required packages
const express = require('express');
const mysql = require('mysql2');
const config = require('./config'); // Import config file

// Creating an express application
const app = express();

app.use(express.json());

// Creating a MySQL connection pool
const pool = mysql.createPool(config.database);

// Defining the signUpUser function to insert user data into the database
function signUpUser(fullname, email, username, password, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL database: ', err);
            return callback(err);
        }
        const query = 'INSERT INTO users (fullname, email, username, password) VALUES (?, ?, ?, ?)';
        connection.query(query, [fullname, email, username, password], (err, result) => {
            connection.release();
            if (err) {
                console.error('Error executing MySQL query: ', err);
                return callback(err);
            }
            console.log('User signed up successfully!');
            callback(null, result);
        });
    });
}
// Define a route to check MySQL server connectivity
app.get('/check-mysql', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL database:', err);
            return res.status(500).json({ error: 'Error connecting to MySQL database' });
        }
        console.log('Connected to MySQL database');
        connection.release();
        res.status(200).json({ message: 'MySQL server is running and accessible' });
    });
});


// Defining a HTTP POST route to handle user sign up
app.post('/signup', (req, res) => {
    const { fullname, email, username, password } = req.body;
    signUpUser(fullname, email, username, password, (err, result) => {
        if (err) {
            res.status(500).send('Error signing up user.');
        } else {
            res.send('Signup successful! Redirecting to home page...');
        }
    });
});

// Defining a HTTP POST route to handle user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Query the database to check if the user exists and password matches
    pool.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, username], (err, results) => {
        if (err) {
            console.error('Error executing MySQL query: ', err);
            return res.status(500).send('Error logging in.');
        }

        if (results.length === 0) {
            // User not found
            return res.status(401).send('User not found.');
        }

        const user = results[0];
        if (user.password !== password) {
            // Incorrect password
            return res.status(401).send('Incorrect password.');
        }

        // Authentication successful
        // Here you can implement your authentication mechanism, such as setting a session or token
        // For simplicity, let's just send a success response
        res.send('Login successful!');
    });
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});