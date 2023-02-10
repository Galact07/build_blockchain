const redis = require("redis");

const Channels = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};

class PubSubs {
  constructor({ blockchain }) {
    this.blockchain = blockchain;
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    this.subscriber.subscribe(Channels.TEST);
    this.subscriber.subscribe(Channels.BLOCKCHAIN);

    this.subscriber.on("message", (channel, message) => {
      this.handleMessage(channel, message);
    });
  }

  handleMessage(channel, message) {
    console.log(`Message reached: ${channel}, Message: ${message}`);
    const chain = JSON.parse(message);
    if (channel === Channels.BLOCKCHAIN) {
      this.blockchain.replaceChain(chain);
    }
  }

  publish({ channel, message }) {
    this.publisher.publish(channel, message);
  }

  broadCast() {
    this.publish({
      channel: Channels.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }
}

module.exports = PubSubs;
