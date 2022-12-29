
const express = require("express");
const router = express.Router();
const assert = require('assert');
const { authMiddleware } = require("../middlewares/auth");

/**
 * @desc retrieves list of all articles/blogs for the logged in user
 */
router.get('/list', authMiddleware, function (req, res) {
  global.db.all(
    "SELECT * FROM articles where user_record_id = ?;",
    [req.session.userid],
    function (err, data) {
      if (err) {
        console.log('Error', err)
      } else {
        return res.render('author/articles-list', { data, user: req.session.username });
      }
    }
  );
});


/**
 * @desc creates an article draft and redirects to the edit page
 */
router.get('/create', authMiddleware, function (req, res) {
  //create new article
  global.db.run(
    'INSERT INTO Articles ("user_record_id", "user_record_name", "status", "create_date") VALUES ( ?,?,?, ? );',
    [req.session.userid, req.session.username, "Draft", new Date().toISOString().slice(0, 10)],
    function (err) {
      if (err) {
        console.log(err);
        //return res.render('register-page', { error: "An Error occured" });
      } else {
        return res.redirect('/articles/edit/' + this.lastID);
      }
    }
  );

});


/**
 * @desc edit page for a single article
 */
router.get('/edit/:id', authMiddleware, function (req, res) {
  //fetch record 
  global.db.all(
    "SELECT * FROM articles where article_id = ?;",
    [req.params.id],
    function (err, data) {
      if (err) {
        console.log('Error', err)
      } else {
        return res.render('author/edit-article', { data: data[0], user: req.session.username });
      }
    }
  );
});


/**
 * @desc updates the title, subtitle and content of a particular article/blog
 */
router.post('/edit/:id', authMiddleware, function (req, res) {
  const { title, subtitle, content } = req.body;
  global.db.run(
    'UPDATE Articles set article_title = ? , article_subtitle = ? , article_content = ?, last_modified_date = ? where article_id = ? ;',
    [title, subtitle, content, new Date().toISOString().slice(0, 10), req.params.id],
    function (err) {
      if (err) {
        console.log(err);
        //return res.render('register-page', { error: "An Error occured" });
      } else {
        return res.redirect('/articles/list');
      }
    }
  );
});

/**
 * @desc setting page that displays title, subtitle and author of a specific article in a form
 */
router.get('/settings/:id', authMiddleware, function (req, res) {
  //fetch record
  global.db.all(
    "SELECT * FROM articles where article_id = ?;",
    [req.params.id],
    function (err, data) {
      if (err) {
        console.log('Error', err)
      } else {
        return res.render('author/article-settings', { data: data[0], user: req.session.username });
      }
    }
  );
});

/**
 * @desc updates the title, subtitle and author of a particular article/blog from the settings page
 */
router.post('/settings/:id', function (req, res) {
  const { title, subtitle, author } = req.body;
  global.db.run(
    'UPDATE Articles set article_title = ? , article_subtitle = ? , user_record_name = ?, last_modified_date = ? where article_id = ? ;',
    [title, subtitle, author, new Date().toISOString().slice(0, 10), req.params.id],
    function (err) {
      if (err) {
        console.log(err);
        //return res.render('register-page', { error: "An Error occured" });
      } else {
        return res.redirect('/articles/list');
      }
    }
  );
});

/**
 * @desc completely removes a particular article/blog from the database
 */
router.get('/delete/:id', function (req, res) {
  const { title, subtitle, content } = req.body;
  global.db.run(
    'DELETE from Articles where article_id = ? ;',
    [req.params.id],
    function (err) {
      if (err) {
        console.log(err);
        //return res.render('register-page', { error: "An Error occured" });
      } else {
        return res.redirect('/articles/list');
      }
    }
  );
})

/**
 * @desc publishes an article/blog and makes it available to the reader
 */
router.get('/publish/:id', function (req, res) {
  global.db.run(
    'UPDATE Articles set status = ? , published_on = ? where article_id = ? ;',
    ["Published", new Date().toISOString().slice(0, 10), req.params.id],
    function (err) {
      if (err) {
        console.log(err);
        //return res.render('register-page', { error: "An Error occured" });
      } else {
        return res.redirect('/articles/list');
      }
    }
  );
})

module.exports = router;
