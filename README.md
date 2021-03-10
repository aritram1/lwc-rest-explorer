# PostMan clone
This is a simple app written in LWCOSS, can be used to test rest endpoints.

# How to start?
Start simple by running `npm install` followed by `npm run watch`. This will start the project with a local development server.
The source files are located in the [`src`](./src) folder. The web component (app) is within the [`src/client/modules`](./src/modules) folder. The folder hierarchy also represents the naming structure of the web components. The entry file for the custom Express configuration can be found in the ['src/server'](./src/server) folder.

# Features
- Test rest endpoints with GET, POST, PUT and DELETE methods
- Maintain history of the requests sent (in a session)
- Rerun any previous request from history section
- The requests are color coded. The unsuccessfull ones are marked with red.
- Provides the time taken to complete the request.
- More ...

# Screenshot
![Demo.png](https://github.com/aritram1/lwc-rest-explorer/blob/main/src/client/modules/my/postman/Demo.png?raw=true)
![Demo2.png](https://github.com/aritram1/lwc-rest-explorer/blob/main/src/client/modules/my/postman/Demo2.png?raw=true)