import React from "react";
import ListItemCheckbox from "../lists/ListItemCheckbox";

function SetupProperty({ index, title, used, onClick }) {
  var content;
  content = (
    <ListItemCheckbox key={index} title={title} checkboxText='Used on project' value={used} onClick={onClick} />
  );
  return <div>{content}</div>;
}

export default SetupProperty;
