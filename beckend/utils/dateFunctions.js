module.exports = {
  getLocalTimestamp: function(timestamp) {
    var localTimestamp = null;
    if (timestamp) {
      var offset = new Date().getTimezoneOffset() * 60 * 1000 * -1;
      localTimestamp = new Date(timestamp.getTime() + offset);
    }
    return localTimestamp;
  }
};
