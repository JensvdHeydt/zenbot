'use strict'


let MongoClient = require('mongodb').MongoClient
  , assert = require('assert')

let url = 'mongodb://192.168.64.100:27017/zenbot4'


exports.getSessions = function (req, res) {
  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err)
    console.log('Connected correctly to server')

    var collection = db.collection('sessions')
    // Find some documents
    collection.find({}).toArray(function (err, docs) {

      if (err)
        res.send(err)
      res.type('json')
      res.header('Access-Control-Allow-Origin', '*')
      res.json(docs)

      assert.equal(err, null)

      console.log('Found the following records')
      console.dir(docs)
      //callback(docs);
    })
  })
}

exports.getPeriodsForSession = function (req, res) {
  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err)
    console.log('Connected correctly to server')

    var collection = db.collection('periods')
    // Find some documents
    //collection.find({}, { session_id: req.params.sessionId }).toArray(function(err, docs) {
    // collection.find({}, { $text: { session_id: req.params.sessionId } }).toArray(function(err, docs) {
    collection.find({}, {$text: {$search: req.params.sessionId}}).toArray(function(err, docs) {
      if (err)
        res.send(err)
      res.type('json')
      res.header('Access-Control-Allow-Origin', '*')
      res.json(docs)

      assert.equal(err, null)

      console.log('Found the following records')
      console.dir(docs)
      db.close();
    });
  })
}


exports.getSelectors = function (req, res) {
  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err)
    console.log('Connected correctly to server')

    var collection = db.collection('sessions')
    // Find some documents
    collection.distinct('selector',function(err, docs) {
      if (err)
        res.send(err)
      returnAsJson(docs, res)
      assert.equal(err, null)

      console.log('Found the following records')
      console.dir(docs)
    })
  })
}

function returnAsJson(docs, res) {
  res.type('json')
  res.header('Access-Control-Allow-Origin', '*')
  res.json(docs)
}