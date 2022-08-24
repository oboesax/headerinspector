const express = require("express");
const router = new express.Router();
require("dotenv").config();

router.get("/", (req, res) => {
    // console.log(JSON.stringify(req.headers));
    res.send('hello headers!');
    // res.send(`${Object.keys(req)}`);
    // res.send(JSON.stringify(req.headers));
});

module.exports = router;
