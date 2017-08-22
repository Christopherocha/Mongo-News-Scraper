// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use body parser with our app
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/newsScrape");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

app.get("/scrape", function(req, res) {
    request("https://www.reddit.com/r/LiverpoolFC/", function(err, response, html) {
        var $ = cheerio.load(html);

        // console.log($(".thing").html())
        // Now, we grab every h2 within an article tag, and do the following:
        $(".thing").each(function(i, element) {
        
            // Save an empty result object
            var result = {};
            // console.log($(this).text())
            result.title = $(this).text();
            result.link = $(this).children("p.title").attr("href");
            result.img = $(this).children("img").attr("src");

            var entry = new Article(result);
            
            // Now, save that entry to the db
            entry.save(function(error, doc) {
                // Log any errors
                if (err) {
                    console.log(error);
                    // res.send(err);
                }
                // Or log the doc
                else {
                    console.log(doc);
                }
            });
            
        })
    })
    res.send("News scraped")
})

// Listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});