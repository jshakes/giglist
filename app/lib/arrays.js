module.exports = {
  chunkArray: function(array, chunkLimit) {
    var chunks = [];
    for(i = 0; i < array.length; i+=chunkLimit) {
      chunks.push(array.slice(i, i+chunkLimit));
    }
    return chunks;
  }
};
