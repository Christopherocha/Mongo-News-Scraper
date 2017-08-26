var Article = require('../models/Article');
var express = require("express");
var router = express.Router();
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

router.get("/scrape", function(req, res) {
    request("https://www.reddit.com/r/LiverpoolFC/", function(err, response, html) {
        var $ = cheerio.load(html);

        // Now, we grab every h2 within an article tag, and do the following:
        $(".title").each(function(i, element) {
        
            // Save an empty result object
            var result = {};
            // console.log($(this).text())
            result.title = $(element).text();
            result.link = $(element).attr("href");
            // result.img = $(element).children("img").attr("src");

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
                    // console.log(doc);
                }
            });
            
        })
    })
    res.redirect("/article");
})

router.get("/", function(req, res) {
    Article.find({})
    .populate("note")
    .exec(function(err, result) {
        var hbsObject = { article: result};
        res.render('index', hbsObject)
    })
})

module.exports = router;