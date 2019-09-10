import React from "react";
import spinner from "../../img/spinner.gif";

export default function Spinner() {
  return (
    <div>
      <img src={spinner} style={{ width: "300px", margin: "auto", display: "block" }} alt="Loading..." />
    </div>
  );
}
