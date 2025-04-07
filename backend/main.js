// Get the client
const mysql = require('mysql2');
require('dotenv').config()

// ATTENTION REQUIRED: Create the connection to database

const pool = mysql.createPool({
    host: process.env.SQL_HOSTNAME,
    user: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DBNAME,
});

// Set up the API
const express = require('express')
var cors = require('cors');
const bodyParser = require('body-parser')
const app = express()
const port = 3001

// Make it available for public access

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
});

app.use(cors());
app.options("*", cors());

app.set('json spaces', 2)
app.use(bodyParser.json({
    limit: "50mb"
}))
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

// Listen to outside connection

app.listen(port, () => {
    console.log(`App running on port ${port}. Control+C to exit.`)
})

// Spit out data

app.get('/', (request, response) => {
    response.json({ info: 'Backend for Fitness App, set up by Romeo Martin R.' })
})

app.get("/users",(request, response) => {

    pool.query("SELECT name, email, age FROM Users ORDER BY id", [], (error, result) =>{

        console.error(error);
        console.log(result);

        response.json(
            {
                status: "success",
                data: result
            }
        )
    });

})

app.get("/monthlyTracking",(request, response) => {

    pool.query(`SELECT user_name from MonthlyActivityTracking
        ORDER BY total_distance`, [], (error, result) =>{

        console.error(error);
        console.log(result);

        response.json(
            {
                status: "success",
                data: result
            }
        )
    });

})

app.get("/sleepQuality",(request, response) => {

    pool.query(`SELECT sleep_quality, AVG(sleep_duration) AS avg_hours
FROM Sleep
GROUP BY sleep_quality`, [], (error, result) =>{

        console.error(error);
        console.log(result);

        response.json(
            {
                status: "success",
                data: result
            }
        )
    });

})