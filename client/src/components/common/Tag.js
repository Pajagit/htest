import React from "react";

function Tag({ title, color, isRemovable }) {
  var classColor = color;
  var className = "tag";
  if (color) {
    className = `tag ${classColor}`;
  }

  var remove = "";
  if (isRemovable) {
    remove = (
      <div className="tag--remove">
        <i className="fas fa-times"></i>{" "}
      </div>
    );
  }
  return (
    <div className={className}>
      <div className="tag--title">{title} </div>
      {remove}
    </div>
  );
}
export default Tag;
