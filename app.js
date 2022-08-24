const express = require("express");
const cors = require("cors");

const viewheadersRouter = require("./routers/viewheaders");

const app = express();

const allowlist = [
    "http://localhost:3000",
    "http://localhost:3050",
    "https://headers.oboesax.com",
];
const corsOptions = {
  origin: allowlist,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(viewheadersRouter);

module.exports = app;
