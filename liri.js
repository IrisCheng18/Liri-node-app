// read and set the environment variables with the dotnev package
require("dotenv").config();

// core node package for reading and writing files
var fs = require("fs");

// imports the 'keys.js' file
var keys = require("./keys.js");
// console.log(keys);
console.log('Keys loaded');

// access the keys information
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

// include the axios npm package
var axios = require("axios");

// include the moment npm package
var moment = require("moment");

// use 'inquirer' package to interact with the user
var inquirer = require("inquirer");
inquirer
    .prompt([
        {
            type: "list",
            message: "What do you want to do?",
            choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
            name: "command"
        }
    ])
    .then(function (inquirerResponse) {
        // console.log(inquirerResponse);
        var choices = {
            "concert-this": {
                message: "What is the name of the artist?",
                name: "artist",
                function: function (artist) {
                    concertThis(artist);
                }
            },
            "spotify-this-song": {
                message: "What is the name of the song?",
                name: "songName",
                function: function (songName) {
                    spotifyThisSong(songName);
                }
            },
            "movie-this": {
                message: "What is the name of the movie?",
                name: "movieName",
                function: function (movieName) {
                    movieThis(movieName);
                }
            }
        };
        // console.log(choices[inquirerResponse.command].message);
        // console.log(choices[inquirerResponse.command].name);

        switch (inquirerResponse.command) {
            case "concert-this":
            case "spotify-this-song":
            case "movie-this":
                inquirer
                    .prompt([
                        {
                            type: "input",
                            message: choices[inquirerResponse.command].message,
                            name: choices[inquirerResponse.command].name
                        }
                    ])
                    .then(function (response) {
                        // console.log(response);
                        // console.log(response[choices[inquirerResponse.command].name]);
                        choices[inquirerResponse.command].function(response[choices[inquirerResponse.command].name]);
                    });
                break;
            case "do-what-it-says":
                fs.readFile("random.txt", "utf8", function (err, data) {
                    if (err) {
                        return console.log(err);
                    };

                    // console.log(data);
                    var dataArr = data.split(",");
                    // console.log(dataArr);

                    var command = dataArr[0];
                    var name = dataArr[1].replace(/\"/g, " ").trim();

                    choices[command].function(name);
                });
                break;
        };
    });


function concertThis(artist) {
    // console.log(artist);
    if (artist === "") {
        console.log("There is no artist's name input.");
        logFile("\nconcert-this ");
        logFile("\nThere is no artist's name input");
        return;
    };

    logFile("\nconcert-this " + artist + "\n");

    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp&date=upcoming";
    axios.get(queryURL).then(
        function (bandsintownResponse) {
            // console.log(bandsintownResponse.data);

            console.log("Upcoming concerts for " + artist + ":");
            logFile("Upcoming concerts for " + artist + ":");

            for (prop in bandsintownResponse.data) {
                var dataObj = bandsintownResponse.data[prop];
                // moment.HTML5_FMT.DATETIME_LOCAL_SECONDS: YYYY-MM-DDTHH:mm:ss
                var convertedDate = moment(dataObj.datetime, moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);

                var logData = dataObj.venue.city + "," + dataObj.venue.region + " at " + dataObj.venue.name + " " + convertedDate.format("MM/DD/YYYY");
                console.log(logData);
                logFile(logData + "\n");
            };
        }
    );
};

function movieThis(movieName) {
    if (movieName === "") movieName = "Mr. Nobody";

    logFile("\nmovie-this " + movieName + "\n");

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(
        function (omdbResponse) {
            // console.log(omdbResponse.data);

            // for (prop in omdbResponse.data) {
            //     console.log(prop + ": " + omdbResponse.data[prop]);
            // };

            var dataObj = omdbResponse.data;
            var logData = [
                "Title: " + dataObj.Title,
                "Year: " + dataObj.Year,
                "IMDB Rating: " + dataObj.imdbRating,
                "Country: " + dataObj.Country,
                "Language: " + dataObj.Language,
                "Plot: " + dataObj.Plot,
                "Actors: " + dataObj.Actors,
                "Rotten Tomatoes Rating: " + dataObj.Ratings[1].Value + "\n"
            ].join("\n");

            console.log(logData);
            logFile(logData);
        }
    );

};

function spotifyThisSong(songName) {
    if (songName === "") songName = "The Sign";
    console.log(songName);
    logFile("\nspotify-this-song " + songName + "\n");

    //https://api.spotify.com/v1/search?query=All+the+Small+Things&type=track&offset=0&limit=20
    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        for (var i = 0; i < data.tracks.items.length; i++) {
            var dataObj = data.tracks.items[i];
            var logData = [
                i,
                "artist(s): " + dataObj.album.artists[0].name,
                "song name: " + dataObj.name,
                "preview song: " + String(dataObj["preview_url"]),
                "album: " + dataObj.album.name,
                "------------------------\n"
            ].join("\n");

            console.log(logData);
            logFile(logData);
        };
    });
};

function logFile(data) {
    fs.appendFile("./log.txt", data, function (err) {
        if (err) return console.log(err);
    });
};