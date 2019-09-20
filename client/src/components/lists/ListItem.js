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
  var activationContainer;
  if (isActive) {
    activationContainer = (
      <div className="list-item--buttons--remove" onClick={activationOnClick}>
        <i className="fas fa-lock-open"></i>
      </div>
    );
  } else if (isActive === false) {
    activationContainer = (
      <div className="list-item--buttons--remove" onClick={activationOnClick}>
        <i className="fas fa-lock"></i>
      </div>
    );
  } else {
    activationContainer = "";
  }
  var editUserContainer;
  if (loggedIn) {
    editUserContainer = "";
  } else {
    editUserContainer = (
      <Link to={link}>
        <div className="list-item--buttons--edit">
          <i className="fas fa-pen"></i>
        </div>
      </Link>
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
        {editUserContainer}
        {activationContainer}
      </div>
    </div>
  );
}
export default ListItem;
