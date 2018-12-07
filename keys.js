require("dotenv").config();
// console.log('Keys loaded');
// console.log(process.env.SPOTIFY_ID);
// console.log(process.env.SPOTIFY_SECRET);

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};