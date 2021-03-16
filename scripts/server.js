// Simple Express server setup to serve for local testing/dev API server
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
// const path = require('path');

const app = express();
app.use(helmet());
app.use(compression());

app.use(express.json());

// const DIST_DIR = './dist';

const host = 'localhost';
const defaultPort = 3002;

const HOST = process.env.API_HOST || host;
const PORT = process.env.API_PORT || defaultPort;

////////////////////////////Front end server/////////////////////////////////////
// app.use(express.static(DIST_DIR));

// //app.use('*', (req, res) => {
// app.use('/fe/postman', (req, res) => {
//     // res.sendFile(path.resolve(DIST_DIR, 'index.html'));
//     res.sendFile('index.html');
// });
/////////////////////////////////////////////////////////////////////////////////

// CORS middleware
app.use(function (req, res, next) {
    //res.append('Access-Control-Allow-Origin', `http://${host}:${defaultPort}`);
    //res.append('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.append('Access-Control-Allow-Origin', '*');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
}); 

let createResponse = function(path){
    let time = new Date();
    return {
        'msg' : `reached ${path}`,
        'Time' : '' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() 
    };
}

let handlePost = function(req){
    let data = {
        'headers' : req.headers,
        'body' : req.body,
        'query' : req.query
    };
    return data;
}

app.use('/post', (req, res)=>{
    let response = {
        method : req.method
    };
    switch(req.method){
        case 'GET':
            console.log(new Date() + ' Inside GET');
            break;
        case 'POST':
            console.log(new Date() + 'Inside POST');
            console.log('-->' + handlePost(req));
            response.data = handlePost(req);
            break;
        default:
            console.log('Inside DEFAULT');
            break;
    }
    res.send(response);
});

app.get('/', (req, res) => {
    //  console.log(`You are inside main get request. Welcome! Some request params are : ${JSON.stringify(req.params)}. Done!`);
    let data = createResponse('/');
    res.json(data);
});

app.listen(PORT, () =>
    console.log(
        `✅  The API Server started:  http://${HOST}:${PORT}`
    )
);