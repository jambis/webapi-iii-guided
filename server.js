const express = require("express"); // importing a CommonJS module
const helmet = require("helmet");

const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

function methodUrlLogger(req, res, next) {
  console.log(`${req.method} method to the URL ${req.originalUrl}`);

  next();
}

function gateKeeper(req, res, next) {
  const password = req.headers.password || "";
  if (password.toLowerCase() === "mellon") {
    next();
  } else if (!req.headers.password) {
    res.status(400).json({ message: "Please provide a password" });
  } else {
    res.status(401).json({ message: "You shall not pass" });
  }
}

server.use(helmet());
server.use(express.json());
server.use(methodUrlLogger);
server.use(gateKeeper);

server.use("/api/hubs", hubsRouter);

server.get("/", (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : "";

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

module.exports = server;
