const getIdsFromObjArray = array => {
  var ids = array.map(function(item) {
    return item["id"];
  });
  return ids;
};
export default getIdsFromObjArray;
