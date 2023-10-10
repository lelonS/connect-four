let lastUniqueChannel = '';
function getUniqueChannel() {
  // 10 characters channel name
  lastUniqueChannel = Math.random().toString(36).substring(2, 12);
  return lastUniqueChannel;
}

function getLastUniqueChannel() {
  return lastUniqueChannel;
}

// To be able to use with "import"
module.exports = {
  getUniqueChannel,
  getLastUniqueChannel
};
