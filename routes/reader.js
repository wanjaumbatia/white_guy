
/**
 * These are example routes for user management
 * This shows how to correctly structure your routes for the project
 */

const express = require("express");
const router = express.Router();
const assert = require('assert');

router.get("/home", (req, res) => {
    //fetch all published articles order by publication date
    global.db.all(
        "SELECT * FROM articles where status = 'Published' ORDER BY published_on DESC;",
        function (err, data) {
            if (err) {
                console.log('Error', err)
            } else {
                return res.render('reader/homepage', { data });
            }
        }
    );
});

router.get("/article/:id", (req, res) => {
    //fetch all published articles order by publication date
    global.db.all(
        "SELECT * FROM articles where article_id = ?;",
        [req.params.id],
        function (err, data) {
            if (err) {
                console.log('Error', err)
            } else {
                return res.render('reader/article', { data: data[0] });
            }
        }
    );
});

router.get("/like_article/:id", (req, res) => {
    //fetch all published articles order by publication date
    global.db.all(
        "SELECT * FROM articles where article_id = ?;",
        [req.params.id],
        function (err, data) {
            if (err) {
                console.log('Error', err)
            } else {
                global.db.run(
                    "UPDATE articles set number_likes = ? where article_id = ?;",
                    [data[0].number_likes + 1, req.params.id],
                    function (err) {
                        if (err) {
                            console.log('Error', err)
                        } else {
                            return res.redirect('/reader/article/' + data[0].article_id);
                        }
                    }
                );
            }
        }
    );
});

module.exports = router;
