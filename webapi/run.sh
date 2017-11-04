#!/bin/bash
sleep 5;
npm install;
# npm start

node_modules/.bin/nodemon --watch ./api --legacy-watch ./server.js
