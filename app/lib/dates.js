module.exports = {
  toYYYYMMDD: function(date) {
    date = date || new Date();
    var dateArr = [date.getFullYear(), ('0' + (date.getMonth() + 1)).slice(-2), ('0' + date.getDate()).slice(-2)];
    return dateArr.join('-');
  }
};
