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

    if (!movieName) {
        movieName = "Mr Nobody";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        if (error) {
            console.log('error:', error); // Print the error if one occurred
        } else {
            var jsonData = JSON.parse(body);

            output = "\n================= LIRI RESULTS ==================" + '\n' +
                '\nTitle: ' + jsonData.Title + '\n' +
                '\nYear: ' + jsonData.Year + '\n' +
                '\nRated: ' + jsonData.Rated + '\n' +
                '\nIMDB Rating: ' + jsonData.imdbRating + '\n' +
                '\nRotten Tomatoes Rating: ' + jsonData.Ratings[1].Value + '\n' +
                '\nCountry: ' + jsonData.Country + '\n' +
                '\nLanguage: ' + jsonData.Language + '\n' +
                '\nPlot: ' + jsonData.Plot + '\n' +
                '\nActors: ' + jsonData.Actors + "\n\n\n";

            console.log(output);

            fs.appendFile("log.txt", output, function (err) {
                if (err) throw err;
                console.log('Saved to log.txt!');
            });
        }
    });

}

function spotifySearch(songName) {
    var spotify = new Spotify(keys.spotify);

    if (!songName) {
        songName = "The Sign";
    } else {

        spotify.search({ type: 'track', query: songName }, function (err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            } else {
                output = "\n================= LIRI RESULTS ==================" + '\n' +
                    "\nSong Name: " + songName.toUpperCase() + '\n' +
                    "\nAlbum Name: " + data.tracks.items[0].album.name + '\n' +
                    "\nArtist Name: " + data.tracks.items[0].album.artists[0].name + '\n' +
                    "\nURL: " + data.tracks.items[0].album.external_urls.spotify + "\n\n\n" +
                    "================================================";
                console.log(output);

                fs.appendFile("log.txt", output, function (err) {
                    if (err) throw err;
                    console.log('Saved to log.txt!');
                });
            };
        });
    }
}

function recentTweets() {
    var client = new twitter(keys.twitter);
    var params = { screen_name: '540life', count: 20 };

    client.get('statuses/user_timeline', params, function (err, tweets, res) {

        if (!err) {
            var data = [];
            for (let i = 0; i < tweets.length; i++) {
                data.push({
                    '\n================= RECENT TWEET ==================': [i],
                    'created at: ': tweets[i].created_at,
                    'Tweets: ': tweets[i].text,
                });
            }
            console.log(data);
            writeToLog(data);
        }
    });
};

function tweetThis(tweetContent) {

    if (!tweetContent) {
        tweetContent = "This is a random tweet!";
    } else {

        var client = new twitter(keys.twitter);

        client.post('statuses/update', { status: tweetContent }, function (error, tweet, response) {
            if (error) throw error;
            console.log(`"${tweetContent}" was posted to your twitter profile successfully!`);
            writeToLog(tweetContent + " was posted to your twitter profile successfully!");
        });
    }
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log(error);
        } else {
            console.log(data);
            writeToLog(data);
            var dataArr = data.split(',')

            if (dataArr.length == 2) {
                choice(dataArr[0], dataArr[1]);
            } else if (dataArr.length == 1) {
                (dataArr[0]);
            }
        }
    });
}


function choice(caseData, functionData) {
    switch (caseData) {
        case 'spotify-search-this':
            spotifySearch(functionData);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        case 'my-tweets':
            recentTweets();
            break;
        case 'tweet-this':
            tweetThis(functionData);
            break;
        case 'movie-search-this':
            movieSearch(functionData);
            break;
        default:
            console.log('LIRI doesn\'t understand, please try again!');
            break;
    }
}

function appStart(argOne, argTwo) {
    choice(argOne, argTwo);
};

appStart(process.argv[2], process.argv.slice(3).join(" "));


