import React from "react";
import isEmpty from "../../validation/isEmpty";
import { Link } from "react-router-dom";

function ListItem({ img, title, list, msg, activationOnClick, isActive, loggedIn, link }) {
  if (!isEmpty(img)) {
    var imageContainer = (
      <div className="list-item--image">
        <img src={img} alt=""></img>
      </div>
    );
  }

  return (
    <Link to={link}>
      <div className="list-item">
        {imageContainer}
        <div className="list-item--text">
          <div className="list-item--text--title">{title}</div>
          <div className="list-item--text--list">{list}</div>

          <div className="list-item--text--msg">{msg}</div>
        </div>
        <div className="list-item--buttons"></div>
      </div>
    </Link>
  );
}
export default ListItem;
