const express = require("express");
const apiRouter = require("./api/api-router");
const server = express();
const cors = require('cors');

server.use(express.json());
server.use(cors())

server.use("/api", apiRouter);

server.get("/", (req, res) => {
  res.send("Welcome to my API");
});

const port = 5001;
server.listen(port, ()=>{console.log(`\n***Server listening on port ${port}***\n`)});
