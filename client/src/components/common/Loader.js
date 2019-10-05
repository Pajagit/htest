import React from "react";
import loader from "../../img/loader.gif";

export default function Loader() {
  return (
    <div>
      <img src={loader} style={{ width: "63px", display: "block" }} alt="Loading..." />
    </div>
  );
}
