const Block = require("./block");
const cryptoHash = require("./crypto-hash");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addNewBlock({ data }) {
    const newBlock = Block.mineBlock({
      prevBlock: this.chain[this.chain.length - 1],
      data,
    });
    this.chain.push(newBlock);
  }

  //We always have to select the longest chain
  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error("The incoming chain is short");
      return;
    }
    const validate = Blockchain.validChain(chain);
    if (!validate) {
      console.error("Chain validation failed");
      return;
    }
    this.chain = chain;
  }

  static validChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, data, hash, prevHash, nonce, difficulty } = chain[i];

      if (prevHash !== chain[i - 1].hash) {
        return false;
      }

      const validatedHash = cryptoHash(
        timestamp,
        data,
        prevHash,
        nonce,
        difficulty
      );
      if (validatedHash !== hash) return false;
      if (Maths.abs(chain[i - 1].difficulty - difficulty) > 1) return false;
    }
    return true;
  }
}

// const blockchain = new Blockchain();

// blockchain.addNewBlock({ data: "block1" });
// blockchain.addNewBlock({ data: "block2" });

// const result = Blockchain.validChain(blockchain.chain);

// console.log(blockchain.chain);

module.exports = Blockchain;
