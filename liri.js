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
        processCommand(inquirerResponse.command);
    });

function processCommand(command) {
    switch (command) {
        case "concert-this":
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "What is the name of the artist?",
                        name: "artist"
                    }
                ])
                .then(function (response) {
                    // console.log(response);
                    
                    if(response.artist !== "") {
                        concertThis(response.artist);
                    } else {
                        console.log("There is no artist's name input.");
                        logFile("\nconcert-this ");
                        logFile("\nThere is no artist's name input");
                    };

                });
            break;
        case "spotify-this-song":
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "What is the name of the song?",
                        name: "songName"
                    }
                ])
                .then(function (response) {
                    // console.log(response);

                    if (response.songName !== "") {
                        spotifyThisSong(response.songName);
                    } else {
                        spotifyThisSong("The Sign");
                    };
                });
            break;
        case "movie-this":
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "What is the name of the movie?",
                        name: "movieName"
                    }
                ])
                .then(function (response) {
                    // console.log(response);

                    if (response.movieName !== "") {
                        movieThis(response.movieName);
                    } else {
                        movieThis("Mr. Nobody");
                    };
                });
            break;
        case "do-what-it-says":
            fs = require("fs");
            fs.readFile("random.txt", "utf8", function (err, data) {
                if (err) {
                    return console.log(err);
                };

                // console.log(data);
                var dataArr = data.split(",");
                // console.log(dataArr);

                var command = dataArr[0];
                var name = dataArr[1].replace(/\"/g, " ").trim();

                switch (command) {
                    case "concert-this":
                        concertThis(name);
                        break;
                    case "spotify-this-song":
                        spotifyThisSong(name);
                        break;
                    case "movie-this":
                        movieThis(name);
                        break;
                };
            });
            break;
    };

};

function concertThis(artist) {
    // console.log(artist);
    logFile("\nconcert-this " + artist + "\n");

    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp&date=upcoming";
    axios.get(queryURL).then(
        function (bandsintownResponse) {
            // console.log(bandsintownResponse.data);

            console.log("Upcoming concerts for " + artist + ":");
            logFile("Upcoming concerts for " + artist + ":");

            for (prop in bandsintownResponse.data) {
                var venueCity = bandsintownResponse.data[prop].venue.city;
                var venueRegion = bandsintownResponse.data[prop].venue.region;
                var venueName = bandsintownResponse.data[prop].venue.name;
                // moment.HTML5_FMT.DATETIME_LOCAL_SECONDS: YYYY-MM-DDTHH:mm:ss
                var convertedDate = moment(bandsintownResponse.data[prop].datetime, moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
                console.log(venueCity + "," + venueRegion + " at " + venueName + " " + convertedDate.format("MM/DD/YYYY"));
                logFile(venueCity + "," + venueRegion + " at " + venueName + " " + convertedDate.format("MM/DD/YYYY") + "\n");
            };
        }
    );
};

function movieThis(movieName) {
    logFile("\nmovie-this " + movieName + "\n");

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(
        function (omdbResponse) {
            // console.log(omdbResponse.data);

            // for (prop in omdbResponse.data) {
            //     console.log(prop + ": " + omdbResponse.data[prop]);
            // };

            var title = omdbResponse.data.Title;
            var year = omdbResponse.data.Year;
            var ratingIMDB = omdbResponse.data.imdbRating;
            var ratingRottenTomatoes = omdbResponse.data.Ratings[1].Value;
            var country = omdbResponse.data.Country;
            var language = omdbResponse.data.Language;
            var plot = omdbResponse.data.Plot;
            var actors = omdbResponse.data.Actors;

            console.log("Title: " + title);
            console.log("Year: " + year);
            console.log("IMDB Rating: " + ratingIMDB);
            console.log("Country: " + country);
            console.log("Language: " + language);
            console.log("Plot: " + plot);
            console.log("Actors: " + actors);
            console.log("Rotten Tomatoes Rating: " + ratingRottenTomatoes);

            logFile("Title: " + title + "\nYear: " + year + "\nIMDB Rating: " + ratingIMDB + "\nCountry: " + country + "\nLanguage: " + language + "\nPlot: " + plot + "\nActors: " + actors + "\nRotten Tomatoes Rating: " + ratingRottenTomatoes + "\n");
        }
    );

};
function spotifyThisSong(songName) {
    console.log(songName);
    logFile("\nspotify-this-song " + songName + "\n");

    //https://api.spotify.com/v1/search?query=All+the+Small+Things&type=track&offset=0&limit=20
    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        for (var i = 0; i < data.tracks.items.length; i++) {
            var artist = data.tracks.items[i].album.artists[0].name;
            var songName = data.tracks.items[i].name;
            var previewUrl = String(data.tracks.items[i]["preview_url"]);
            var albumName = data.tracks.items[i].album.name;
            console.log(i);
            console.log("artist(s): " + artist);
            console.log("song name: " + songName);
            console.log("preview song: " + previewUrl);
            console.log("album: " + albumName);
            console.log("------------------------");

            logFile(i + "\nartist(s): " + artist +"\nsong name: " + songName +"\npreview song: " + previewUrl+"\nalbum: " + albumName + "\n------------------------\n");
        };
    });
};

function logFile(data) {
    fs.appendFile("./log.txt", data, function(err) {
        if (err) console.log(err);
    });
};