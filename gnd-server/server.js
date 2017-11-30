/////////////////
// DB SERVER
/////////////////

const mongoose = require('mongoose');
const path = require("path");

const Tweet = require('./models/Tweet');

const DBSERVER_PORT = 27017;

const MONGO_CONNECTION_STRING = 'mongodb://localhost:27017/data/db';

mongoose.connect(MONGO_CONNECTION_STRING);

const connection = mongoose.connection;

connection.on('open', ()=>{
    console.log('The MongoDB Server is running on port', DBSERVER_PORT);
}); 

/////////////////
// APP SERVER
/////////////////


const TWITTER_KEYS = require('./CONFIG');
const PORT = process.env.PORT || 8080;

const express = require('express');
const cors = require('cors');
const app = express();

const axios = require('axios');
const fs = require('fs');

const Twitter = require('twitter');

app.use(express.static('public'));
app.use(cors());
app.use(express.static(path.join(__dirname, '../gnd-client', 'build')));

app.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/top-trends-locations', (req, res) => {
    let client = new Twitter(TWITTER_KEYS);

    const TWITTER_ENDPOINT = req.params.location === 'world' ? 'trends/available' : 'trends/closest';
    const TWITTER_ENDPOINT_PARAMS = req.params.location === 'world' ? {} : { lat: req.query.latitude, long: req.query.longitude/*lat: 56.1304, long: -106.3468*/ };

    client.get(TWITTER_ENDPOINT, TWITTER_ENDPOINT_PARAMS, function (error, locations, response) {
        if (!error) {
            return res.json(locations);
        }
        console.log(error);
        return res.json({});
    });
})

// returns the list of trends near a specific location (lat, long)
app.get('/top-trends', (req, res) => {
    let client = new Twitter(TWITTER_KEYS);

    const TWITTER_ENDPOINT = req.params.location === 'world' ? 'trends/available' : 'trends/closest';
    const TWITTER_ENDPOINT_PARAMS = req.params.location === 'world' ? {} : { lat: req.query.latitude, long: req.query.longitude };

    client.get(TWITTER_ENDPOINT, TWITTER_ENDPOINT_PARAMS, function (error, locations, response) {
        if (!error) {
            if (locations.length === 0) {
                res.json({});
            }
//            let location = locations[0];
//            let topTrends = [];
            locations.forEach(function(location) {
                client.get('trends/place', { id: location.woeid }, function (error, tweets, response) {
                    if (!error) {
                        tweets[0].trends.forEach(function(trend) {
                            if (trend.tweet_volume) {
                                // new Tweet({
                                //     country: 'COUNTRY SHOULD BE DYNAMIC',
                                //     countryCode: 'COUNTRY SHOULD BE DYNAMIC',
                                //     latitude: req.query.latitude,
                                //     longitude: req.query.longitude,
                                //     woeid: location.woeid,
                                //     name: trend.name,
                                //     url: trend.url,
                                //     volume: trend.tweet_volume,
                                // })
                                // .save()
                                // .then(savedTweet=>{
                                    
                                // })
                                // .catch(error=>{
                                //     console.log(error);
                                // })
                            }
                        })
                        return res.json(tweets[0].trends);
                    }
                    else {
                        console.log(error);
                        return res.json([]);
                    }
                });
            }, this);
        }
        else {
            console.log(error);
            return res.json([]);
        }
    });
})

// app.get('/getWOEID/:country', (req, res) => {
//     axios.get(`https://developer.yahoo.com/yql/console/#h=select+woeid+from+geo.places+where+text%3D%22#${req.params.country}%22`)
//     .then(result => {
//         console.log(result);
//         //console.log("WOEID=======>", result.data.results.place[0].woeid);
//         return res.json(null);
//     })
//     .catch(error => {
//         console.log(error);
//     })
// })
    
// temporary endpoint to provide some static data
app.get('/data', (request, response) => {
    let populationData = JSON.parse(fs.readFileSync("/Users/amirnafei/threejs-test/globe/population909500-1.json"));

    for (let i=0; i < populationData[0][1].length; i += 3) {
        new Tweet({
            country: '',
            countryCode: '',
            latitude: populationData[0][1][i],
            longitude: populationData[0][1][i+1],
            woeid: '',
            name: 'name'+i,
            url: ' ',
            volume: .000,
        })
        .save()
        .then(savedTweet=>{
            
        })
        .catch(error=>{
            console.log(error);
        })
    }

    Tweet.find({
    })
    .then(tweets=>{
        let data1 = []
        for (let i=0; i<tweets.length; i++) {
            data1.push(tweets[i].latitude);
            data1.push(tweets[i].longitude);
            data1.push(tweets[i].volume/1000000)
        }
        let data2 = ['1995', data1];
        
        return response.json(populationData.concat([data2]));
    })
    .catch(error=>{
        return response.send(error);
    })
})

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '../gnd-client', 'build/index.html'));
})

app.listen(PORT, () => {
    console.log('The Express Server is running on port', PORT);
})
