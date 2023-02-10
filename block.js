const Blockchain = require("./blockchain");
const { Genesis_Data, MINE_RATE } = require("./config");
const hexToBinary = require("hex-to-binary");
const cryptoHash = require("./crypto-hash");

//Basic Block Structure!
class Block {
  constructor({ timestamp, data, prevHash, hash, difficulty, nonce }) {
    this.timestamp = timestamp;
    this.data = data;
    this.prevHash = prevHash;
    this.hash = hash;
    this.difficulty = difficulty;
    this.nonce = nonce;
  }

  static genesis() {
    return new this(Genesis_Data);
  }

  static mineBlock({ prevBlock, data }) {
    let timestamp, hash;
    let nonce = 0;
    let { difficulty } = prevBlock;
    const prevHash = prevBlock.hash;
    do {
      timestamp = Date.now();
      nonce++;
      difficulty = Block.adjustDifficulty({
        originalBlock: prevBlock,
        timestamp,
      });
      hash = cryptoHash(timestamp, nonce, data, prevHash, difficulty);
    } while (
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    );

    return new Block({
      timestamp,
      prevHash,
      data,
      hash,
      nonce,
      difficulty,
    });
  }

  static adjustDifficulty({ originalBlock, timestamp }) {
    let { difficulty } = originalBlock;
    if (difficulty < 1) {
      return 1;
    }
    const minDifference = timestamp - originalBlock.timestamp;
    if (minDifference > MINE_RATE) {
      difficulty--;
    } else {
      difficulty++;
    }
  }
}

module.exports = Block;
