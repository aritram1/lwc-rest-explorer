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

const host = 'localhost'; //add(this.generate
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
    res.append('Access-Control-Allow-Origin', '*');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
}); 

let handlePost = function(req){
    let data = {
        'headers' : req.headers,
        'body' : req.body,
        'query' : req.query
    };
    return data;
}

let createDefaultResponse = function(path, method){
    let response = {
        'msg' : `reached ${path}`,
        'method' : method,
        'Time now' : new Date()
    };
    return response;
}

let rootHandler = (req, res, next)=>{
    let response = {};
    switch(req.method){
        case 'GET':
            response.data = createDefaultResponse('/', 'GET');
            break;
        case 'POST':
            response.data = createDefaultResponse('/', 'POST');
            response.customdata = handlePost(req);
            break;
        case 'PUT':
            response.data = createDefaultResponse('/', 'PUT');
            response.data.message = req.params.id ? `Record with Id : ${req.params.id} is updated` : 'ID should be provided in POST';
            break;
        case 'DELETE':
            response.data = createDefaultResponse('/', 'DELETE');
            response.data.message = req.params.id ? `Record with Id : ${req.params.id} is deleted` : 'Id not provided in DELETE';
            break;
        default:
            console.log('Inside DEFAULT');
            break;
    }
    res.send(response);
}

app.use('/', rootHandler);
app.use('/:id', rootHandler);

app.listen(PORT, () =>
    console.log(
        `✅  The API Server started:  http://${HOST}:${PORT}`
    )
);