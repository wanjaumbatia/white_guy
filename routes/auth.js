
const express = require("express");
const router = express.Router();
const assert = require('assert');

/**
 * @desc display the login page 
 */
router.get('/login', function (req, res) {
    return res.render('login-page', { error: false });
});

/**
 * @desc Login a user to the website
 */
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    global.db.all(
        "SELECT * FROM UserRecord where user_record_name = ? AND user_record_password = ?;",
        [username, password],
        function (err, data) {
            if (err) {
                console.log('Error', err)
                return res.render('login-page', { error: true });
            } else {
                if (data.length == 0) {
                    return res.render('login-page', { error: true });
                } else {
                    //create session
                    req.session.userid = data[0].user_record_id;
                    req.session.username = data[0].user_record_name;
                    return res.redirect('/articles/list');
                }

            }
        }
    );
});

/**
 * @desc display the register page 
 */
router.get('/register', function (req, res) {
    return res.render('register-page', { error: false });
});


/**
 * @desc Registers an author to the website
 */
router.post("/register", (req, res) => {
    global.db.run(
        'INSERT INTO UserRecord ("user_record_name", "user_record_password") VALUES ( ?,? );',
        [req.body.username, req.body.password],
        function (err) {
            if (err) {
                console.log(err);
                return res.render('register-page', { error: "An Error occured" });
            } else {
                return res.redirect('/auth/login');
            }
        }
    );
});


/**
 * @desc logs out the user and deletes all session
 */
router.get("/logout", function (req, res) {
    req.session.destroy();
    return res.redirect("/");
});

module.exports = router;
