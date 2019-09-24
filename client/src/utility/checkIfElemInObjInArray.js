const checkIfElemInObjInArray = (array, id) => {
  if (array.some(item => item.id === id)) {
    return true;
  } else {
    return false;
  }
};
export default checkIfElemInObjInArray;
