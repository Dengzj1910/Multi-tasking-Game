var express = require('express');
//var redis = require('../config/redis');

var router = express.Router();
//var db = redis();
var fs = require('fs');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://admin:password123@ds121624.mlab.com:21624/multitask_game_514';


router.get('/', function(req, res, next) {
  fs.readdir('./public/images/appImages', function(err, files){
    res.render('index', { images: files });
  });
});

router.put('/api/players', function(req, res, next) {
    var score = req.body.score; // invert so that highest score is on top of redis set
    var player = req.body.player;
    var gametype = req.body.gametype;
    var datetime = new Date().toLocaleString();
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("multitask_game_514");
        var myobj = {score: score, player: player, gametype: gametype, datetime: datetime};
        dbo.collection("player_score_record").insertOne(myobj, function (err, resu) {
            if (err) throw err;
            db.close();
            var js = JSON.stringify(resu);
            console.log("Insert Score Success!");
            res.send(js);
        });
    });
});

router.get('/api/players/highscores', function(req, res, next) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("multitask_game_514");
        dbo.collection("player_score_record"). find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
            res.send(JSON.stringify(result));
        });
  });
});

module.exports = router;
