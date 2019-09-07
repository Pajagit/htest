import React from "react";
import removeBtnImg from "../../img/removeBtn.png";

function RemoveColumnBtn({ label, placeholder, onClick, index }) {
  return (
    <div className="form-element--remove">
      <img src={removeBtnImg} className="form-element--remove-img" alt="Remove" onClick={onClick} id={index} />
    </div>
  );
}

export default RemoveColumnBtn;
