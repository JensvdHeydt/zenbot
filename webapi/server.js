let express = require('express'),
  app = express(),
  port = process.env.WEB_API_PORT || 3002

let routes = require('./api/routes') //importing route


routes(app) //register the route

app.listen(port)

console.log('todo list RESTful API server started on: ' + port)