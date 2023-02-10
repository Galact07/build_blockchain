const crypto = require("crypto");

const cryptoHash = (...values) => {
  const hashAlgo = crypto.createHash("sha256");
  const hashInput = hashAlgo.update(values.sort().join(""));
  const hashValue = hashInput.digest("hex");
  return hashValue;
};

module.exports = cryptoHash;
