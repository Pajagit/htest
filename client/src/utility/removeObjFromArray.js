const removeObjFromArray = (array, obj) => {
  var newArray = array.filter(function(item) {
    return item.id !== obj.id;
  });
  return newArray;
};
export default removeObjFromArray;
