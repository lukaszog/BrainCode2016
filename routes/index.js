'use strict';
var express = require('express');
var router = express.Router();
var twitterSearch = require('../logic/twitterSearch');
var bodyParser = require('body-parser');

var dane = [];

router.use(bodyParser.json());

// Add headers
router.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index');
});

router.post('/api', function(req, res){

   // console.log(req.body.keyword);
  //  res.send(req.body);

    twitterSearch(req.body.keyword, function (data) {
        parse(data);
        res.json(dane);
    });

});

router.post('/search', function(req, res) {


    console.log("Tekst: " + req.body.search);
    twitterSearch(req.body.search, function (data) {
        res.json(data);

    });
});

function parse(data) {
     var html = '';
    for (var i = 0; i < data.length; i++) {
        var s = data[i].sentiment,
            t = data[i].tweet;

        if(s.score != 0 || s.score != null) {
            dane[i] = {
                waga: s.score,
                tweet: t.text
            };
        }
        var _o = {
            imgSrc: t.user.profile_image_url,
            tweetLink: 'http://twitter.com/' + t.user.screen_name + '/status/' + t.id_str,
            tweet: t.text,
            score: s.score ? s.score : '--',
            comparative: s.comparative ? s.comparative : '--',
            favorited: t.favorite_count ? t.favorite_count : 0,
            retweet: t.retweet_count ? t.retweet_count : 0,
            wordsMatched: s.words && s.words.length ? s.words : '--',
            positiveWords: s.positive && s.positive.length ? s.positive : '--',
            negativeWords: s.negative && s.negative.length ? s.negative : '--'
        };
        console.log("Log: " + _o.score);

     };
 }

router.get('/data', function(req, res) {
    res.json(require('diskdb')
        .connect('db', ['sentiments'])
        .sentiments.find());
});

module.exports = router;
