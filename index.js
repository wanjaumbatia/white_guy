const express = require('express');
const app = express();
const port = 3000;
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
var session = require('express-session')

//items in the global namespace are accessible throught out the node application
global.db = new sqlite3.Database('./database.db', function (err) {
  if (err) {
    console.error(err);
    process.exit(1); //Bail out we can't connect to the DB
  } else {
    console.log("Database connected");
    global.db.run("PRAGMA foreign_keys=ON"); //This tells SQLite to pay attention to foreign key constraints
  }
});


const userRoutes = require('./routes/user');
const articlesRoutes = require('./routes/articles');
const authRoutes = require('./routes/auth');
const readerRoutes = require('./routes/reader');

//set the app to use ejs for rendering
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({ secret: 'great_white_guy' }))
// parse application/json
app.use(bodyParser.json())


// app.get('/', (req, res) => {
//   res.send('Hello World!')
// });

//this adds all the userRoutes to the app under the path /user
app.use('/user', userRoutes);
app.use('/articles', articlesRoutes);
app.use('/auth', authRoutes);
app.use('/', readerRoutes);


app.listen(port, () => {
  console.log(`Blog app listening on port ${port}`)
})

