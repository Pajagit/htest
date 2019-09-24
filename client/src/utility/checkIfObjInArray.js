const checkIfObjInArray = (array, obj) => {
  if (array.some(item => item.id === obj.id)) {
    return true;
  } else {
    return false;
  }
};
export default checkIfObjInArray;
