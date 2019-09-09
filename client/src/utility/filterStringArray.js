import isEmpty from "../validation/isEmpty";
const filterItems = arrayToFilter => {
  return arrayToFilter.reduce(function(filteredItems, item) {
    if (!isEmpty(item.value)) {
      var filteredItemsArray = item.value;
      filteredItems.push(filteredItemsArray);
    }
    return filteredItems;
  }, []);
};
export default filterItems;
