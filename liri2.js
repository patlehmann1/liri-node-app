require("dotenv").config();
var keys = require("./keys.js");
var twitter = require("twitter");
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");

function writeToLog(data) {
    fs.appendFile("log.txt", '\r\n\r\n');

    fs.appendFile("log.txt", JSON.stringify(data), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("log.txt was updated!");
    });
}

function movieSearch(movieName) {

    if (movieName = undefined) {
        movieName = "Mr Nobody";

        var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    }

}

