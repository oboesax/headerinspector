const express = require("express");
const router = new express.Router();

router.get("/", (req, res) => {
    // console.log(JSON.stringify(req.headers));
    // res.send('hello headers!');
    // res.send(`${Object.keys(req)}`);
    // console.log(req.httpVersion);
    // console.log(res.httpVersion);
    const message = {};
    message.headers = req.headers;
    message.httpVersion = req.httpVersion;
    res.send(JSON.stringify(message));
});

module.exports = router;
