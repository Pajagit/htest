import React from "react";

function ListItem({ img, title, list }) {
  return (
    <div className="list-item">
      <div className="list-item--image">
        <img src={img} alt=""></img>
      </div>
      <div className="list-item--text">
        <div className="list-item--text--title">{title}</div>
        <div className="list-item--text--list">{list}</div>
      </div>
    </div>
  );
}
export default ListItem;
