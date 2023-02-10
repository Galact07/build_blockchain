const express = require("express");
const BlockChain = require("./blockchain");
const app = express();
const request = require("request");
const bodyParser = require("body-parser");
const PubSubs = require("./publisherSubscriber");
const blockchain = new BlockChain();
const pubSubs = new PubSubs({ blockchain });

setTimeout(() => pubSubs.broadCast(), 1000);

app.use(bodyParser.json());

const default_port = 5000;

const root_node = `http://localhost:${default_port}`;

let peer_port;

if (process.env.GENERATE_PEER_PORT === "true") {
  peer_port = default_port + Math.ceil(Math.random() * 1000);
}

const synChains = () => {
  request({ url: `${root_node}/api/blocks` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);
      console.log("Replace chain on sync with", rootChain);
      blockchain.replaceChain(rootChain);
    }
  });
};

const PORT = peer_port || default_port;

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
  synChains();
});

app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.post("/api/mine", (req, res) => {
  try {
    const data = req.body.data;
    blockchain.addNewBlock({ data });
    pubSubs.broadCast();
    res.redirect("/api/blocks");
  } catch (err) {
    console.log(err.message);
  }
});
