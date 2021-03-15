// Simple Express server setup to serve for local testing/dev API server
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const path = require('path');

const app = express();
app.use(helmet());
app.use(compression());

const DIST_DIR = './dist';

const host = 'localhost';
const defaultPort = 3000;

const HOST = process.env.API_HOST || host;
const PORT = process.env.API_PORT || defaultPort;

////////////////////////////Front end server/////////////////////////////////////
app.use(express.static(DIST_DIR));

//app.use('*', (req, res) => {
app.use('/fe/postman', (req, res) => {
    // res.sendFile(path.resolve(DIST_DIR, 'index.html'));
    res.sendFile('index.html');
});
/////////////////////////////////////////////////////////////////////////////////

// CORS middleware
app.use(function (req, res, next) {
    res.append('Access-Control-Allow-Origin', `http:\\${host}:${defaultPort}`);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/', (req, res) => {
    res.json('Visit /fe/... (for frontend) and /be/... for backend server');
});

app.post('/be/testpost', (req, res) => {
    res.json(`You are inside test post. Some request parmas are : ${req.params}. Done!`);
});

app.listen(PORT, () =>
    console.log(
        `✅  Both API and FrontEnd Server started: http://${HOST}:${PORT}`
    )
);