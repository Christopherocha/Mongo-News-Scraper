var Article = require('../models/Article');
var Note = require('../models/Note');
var express = require("express");
var router = express.Router();
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");

router.get("/scrape", function(req, res) {
    request("https://walkon.com/", function(err, response, html) {
        var $ = cheerio.load(html);
        // Now, we grab every h2 within an article tag, and do the following:
        $(".headline").each(function(i, element) {
            
            // Save an empty result object
            var result = {};
            result.title = $(this).text();
            result.link = $(this).attr("href");

            var entry = new Article(result);
            
            // Now, save that entry to the db
            entry.save().then(function(doc) {
                // console.log(doc.length)
            })
        })
    })
    res.redirect("/")
})

router.get("/", function(req, res) {
    Article.find({}, function(err, results) {
        var hbsObject = { article: results};
        // console.log(hbsObject);
        res.render('index', hbsObject)
    })
})

router.post("/", function(req, res) {
    var entry = new Article(req.body);
    
    // Now, save that entry to the db
    entry.save().then(function(doc) {
        // console.log(doc.length)
    })
    res.redirect("/")
})

router.get("/articles/:id", function(req, res) {
    // console.log(Article.findById(req.params.id).populate("note"))
    Article.findById(req.params.id).
    populate("note").
    exec(function(err, result) {
        if(err){
            console.log(err)
        }
        res.json(result)
    })
})

router.post("/articles/:id", function(req, res) {
    // console.log(req.body);
    var newNote = new Note(req.body);

    newNote.save(function(err, doc) {
        if (err) throw err;

        Article.findOneAndUpdate({ 
            "_id": req.params.id 
        }, 
        { 
            $push: { "note": doc._id }
        }, function(err, results) {
            if (err) throw err;

            res.redirect("/saved")
        })
    })
})

router.get("/save/:id", function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        article.saved = 1;
        
        article.save(function (err, updatedArticle) {
            if (err) return handleError(err);
            res.redirect("/saved");
        })
    })
})

router.get("/saved", function(req, res) {
    Article.find({saved: true}, function(err, results) {
        var hbsObject = { article: results};
        res.render("saved", hbsObject)
    })
})

module.exports = router;