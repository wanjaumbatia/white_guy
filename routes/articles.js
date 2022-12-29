
const express = require("express");
const router = express.Router();
const assert = require('assert');
const { authMiddleware } = require("../middlewares/auth");

router.get('/list', authMiddleware, function (req, res) {
  global.db.all(
    "SELECT * FROM articles;",
    function (err, data) {
      if (err) {
        console.log('Error', err)
      } else {
        return res.render('author/articles-list', { data, user: req.session.username });
      }
    }
  );
});

router.get('/create', authMiddleware, function (req, res) {
  //create new article
  global.db.run(
    'INSERT INTO Articles ("user_record_id", "user_record_name", "status", "create_date") VALUES ( ?,?,?, ? );',
    [req.session.userid, req.session.username, "Draft", new Date()],
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

router.get('/edit/:id', function (req, res) {
  //fetch record 
  global.db.all(
    "SELECT * FROM articles where article_id = ?;",
    [req.params.id],
    function (err, data) {
      if (err) {
        console.log('Error', err)
      } else {
        return res.render('author/edit-article', { data: data[0] });
      }
    }
  );
});

router.post('/edit/:id', function (req, res) {
  const { title, subtitle, content } = req.body;

  global.db.run(
    'UPDATE Articles set article_title = ? , article_subtitle = ? , article_content = ?, last_modified_date = ? where article_id = ? ;',
    [title, subtitle, content, new Date(), req.params.id],
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

router.get('/settings/:id', function (req, res) {
  //fetch record 
  global.db.all(
    "SELECT * FROM articles where article_id = ?;",
    [req.params.id],
    function (err, data) {
      if (err) {
        console.log('Error', err)
      } else {
        return res.render('author/article-settings', { data: data[0] });
      }
    }
  );
});

router.post('/settings/:id', function (req, res) {
  const { title, subtitle, author } = req.body;
  global.db.run(
    'UPDATE Articles set article_title = ? , article_subtitle = ? , user_record_name = ?, last_modified_date = ? where article_id = ? ;',
    [title, subtitle, author, new Date(), req.params.id],
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

router.get('/publish/:id', function (req, res) {
  global.db.run(
    'UPDATE Articles set status = ? , published_on = ? where article_id = ? ;',
    ["Published", new Date(), req.params.id],
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
