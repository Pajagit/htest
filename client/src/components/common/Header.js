import React from "react";
import { Link } from "react-router-dom";

function Header({ icon, title, addBtn, history, canGoBack, filterBtn, searchBtn }) {
  var headerTitle = (
    <div className="main-content--header-title">
      <div className="main-content--header-title-icon">{icon}</div>
      <div className="main-content--header-title-value"> {title}</div>
    </div>
  );
  if (canGoBack) {
    headerTitle = (
      <Link to={"#"} onClick={e => history.history.goBack()}>
        <div className="main-content--header-title">
          <div className="main-content--header-title-icon">{icon}</div>
          <div className="main-content--header-title-value"> {title}</div>
        </div>
      </Link>
    );
  }
  return (
    <div className="main-content--header">
      {headerTitle}
      <div className="main-content--header-buttons">
        {searchBtn}
        {filterBtn}
        {addBtn}
      </div>
    </div>
  );
}
export default Header;
