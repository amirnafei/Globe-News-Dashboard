const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
    country: {type: String},
    countryCode: {type: String},
    latitude: {type: Number},
    longitude: {type: Number},
    woeid: {type: Number},
    name: {type: String, required: true},
    url: {type: String, required: true},
    volume: {type: Number}
});

const TweetModel = mongoose.model('Tweet', tweetSchema);

module.exports = TweetModel;