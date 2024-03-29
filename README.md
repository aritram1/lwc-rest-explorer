# PostMan Lite
This is a simple app, inspired by postman, written in LWCOSS, can be used to test rest endpoints. [`View Live`](https://aritram1.github.io/lwc-rest-explorer/)

# How to start?
Start simply by cloning the repo and running `npm install` followed by `npm run watch`. This will start the project with a local development server. 
The source files are located in the [`src`] folder. The web component (app) is within the [`src/client/modules`] folder. The folder hierarchy also represents the naming structure of the web components. The entry file for the custom Express configuration can be found in the [`src/server`] folder. Build the application running `npm run buildall` (so it builds and moves ./dist to ./docs so it can be deployed to github branch).

# Features
- Test rest endpoints with GET, POST, PUT and DELETE methods
- Maintain history of the requests sent (in a session)
- Rerun any previous request from history section
- The requests are color coded. The unsuccessfull ones are marked with red.
- Provides the time taken to complete the request.
- Previous requests are displayed in detail on hover
- More ...

# Screenshots (in chronology :D )
## First Version with color coded historical requests
![Demo.png](https://github.com/aritram1/lwc-rest-explorer/blob/main/src/client/modules/my/postman/Demo.png?raw=true)

## With Options
![Demo2.png](https://github.com/aritram1/lwc-rest-explorer/blob/main/src/client/modules/my/postman/Demo2.png?raw=true)

## Requests are termed back (The api server is running on express shipped with LWC OSS.)
![Demo3.png](https://github.com/aritram1/lwc-rest-explorer/blob/main/src/client/modules/my/postman/Demo3.png?raw=true)

## With tooltips
![Demo4.png](https://github.com/aritram1/lwc-rest-explorer/blob/main/src/client/modules/my/postman/Demo4.png?raw=true)

