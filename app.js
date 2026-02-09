const express = require("express");
const cors = require("cors");

const viewheadersRouter = require("./routers/viewheaders");

const app = express();
app.set('trust proxy', true);

const allowlist = [
    "http://localhost:3000",
];
if (process.env.CORS_ORIGINS) {
    allowlist.push(...process.env.CORS_ORIGINS.split(","));
}
const corsOptions = {
  origin: allowlist,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(viewheadersRouter);

module.exports = app;
