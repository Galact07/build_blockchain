//Genesis Block Creation
const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 2;
const Genesis_Data = {
  timestamp: 1,
  data: [],
  prevHash: "0x000",
  hash: "0x123",
  nonce: 0,
  difficulty: INITIAL_DIFFICULTY,
};

module.exports = { Genesis_Data, MINE_RATE };
