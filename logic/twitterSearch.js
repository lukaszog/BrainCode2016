//includes
var util = require('util'),
    twitter = require('twitter'),
    sentimentAnalysis = require('./sentimentAnalysis'),
    db = require('diskdb');

db = db.connect('db', ['sentiments']);
//config
var config = {
    consumer_key: 'dts15yBgLluu3rDIIsHTOfah6',
    consumer_secret: 'yz3V6ZVHCafmJmYKKwLfBwKhLc9f6dWhEvg1TnMqFlFdDoFiDe',
    access_token_key: '329255143-QjohNTZV6QqmpTdV0C5Uk9QDCyw1pV3kttgajqVa',
    access_token_secret: 'Hb1esEDzas8YanMeiTNxvRL38jvVOYxx40wVowRk1nBGz',
    count: 100
};

module.exports = function(text, callback) {
    console.log("Test: " + text);
    var twitterClient = new twitter(config);
    var response = [], dbData = []; // to store the tweets and sentiment

    console.log(1, twitterClient.search);

    twitterClient.search(text, {count: 500}, function(data) {

        console.log("Obiekt: " + data);

        for (var i = 0; i < data.statuses.length; i++) {
            var resp = {};


            resp.tweet = data.statuses[i];
            resp.sentiment = sentimentAnalysis(data.statuses[i].text);
            dbData.push({
                tweet: resp.tweet.text,
                score: resp.sentiment.score
            });
            response.push(resp);
        };
        db.sentiments.save(dbData);
        callback(response);
    });
}
