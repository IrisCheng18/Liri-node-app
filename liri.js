// read and set the environment variables with the dotnev package
require("dotenv").config();

// imports the 'keys.js' file
var keys = require("./keys.js");
// console.log(keys);

// access the keys information
// var spotify = new Spotify(keys.spotify);

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

        switch (inquirerResponse.command) {
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
                        var artist = response.artist;
                        var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp&date=upcoming";
                        axios
                            .get(queryURL)
                            .then(function (bandsintownResponse) {
                                // console.log(bandsintownResponse.data);
                                
                                console.log("Upcoming concerts for " + artist + ":");
                                for (prop in bandsintownResponse.data) {
                                    var venueCity = bandsintownResponse.data[prop].venue.city;
                                    var venueRegion = bandsintownResponse.data[prop].venue.region;
                                    var venueName = bandsintownResponse.data[prop].venue.name;
                                    var convertedDate = moment(bandsintownResponse.data[prop].datetime, moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
                                    console.log(venueCity + "," + venueRegion + " at " + venueName + " " + convertedDate.format("MM/DD/YYYY"));
                                };
                            });

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
                        console.log(response);


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

                        var queryUrl = "http://www.omdbapi.com/?t=" + response.movieName + "&y=&plot=short&apikey=trilogy";
                        axios.get(queryUrl).then(
                            function (omdbResponse) {
                                // console.log(omdbResponse.data);

                                for (prop in omdbResponse.data) {
                                    console.log(prop + ": " + omdbResponse.data[prop]);
                                };
                            }
                        );

                    });
                break;
            case "do-what-it-says":
                fs = require("fs");
                break;
        };
    });