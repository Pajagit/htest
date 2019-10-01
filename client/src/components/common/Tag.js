import React from "react";

function Tag({ title, color, isRemovable, onClickRemove }) {
  var classColor = color;
  var className = "tag";
  if (color) {
    className = `tag ${classColor}`;
  }

  var remove = "";
  var clickable = "";
  if (isRemovable) {
    clickable = "clickable";
    remove = (
      <div className={`tag--remove ${clickable}`}>
        <i className="fas fa-times"></i>
      </div>
    );
  }
  return (
    <div className={className} onClick={onClickRemove}>
      <div className={`tag--title ${clickable}`}>{title} </div>
      {remove}
    </div>
  );
}
export default Tag;
