import React from "react";
import isEmpty from "../../validation/isEmpty";
import removeBtn from "../../img/removeBtn.png";

function ListItem({ img, title, list, msg }) {
  if (!isEmpty(img)) {
    var imageContainer = (
      <div className="list-item--image">
        <img src={img} alt=""></img>
      </div>
    );
  }
  return (
    <div className="list-item">
      {imageContainer}
      <div className="list-item--text">
        <div className="list-item--text--title">{title}</div>
        <div className="list-item--text--list">{list}</div>

        <div className="list-item--text--msg">{msg}</div>
      </div>
      <div className="list-item--buttons">
        <div className="list-item--buttons--edit">
          <i className="fas fa-pen"></i>
        </div>
        <div className="list-item--buttons--remove">
          <i className="fas fa-lock-open"></i>
        </div>
      </div>
    </div>
  );
}
export default ListItem;
