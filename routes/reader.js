
/**
 * These are example routes for user management
 * This shows how to correctly structure your routes for the project
 */

const express = require("express");
const router = express.Router();
const assert = require('assert');

router.get("/home", (req, res) => {
    console.log("reader homepage");
});

module.exports = router;
