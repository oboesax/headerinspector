const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const viewheadersRouter = require("./routers/viewheaders");

const app = express();
app.set('trust proxy', true);
app.disable('x-powered-by');

// Rate limiting
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
}));

// CORS
const allowlist = [
    "http://localhost:3000",
];
if (process.env.CORS_ORIGINS) {
    allowlist.push(...process.env.CORS_ORIGINS.split(",").map(o => o.trim()));
}
app.use(cors({ origin: allowlist }));

app.use(express.json());
app.use(viewheadersRouter);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
