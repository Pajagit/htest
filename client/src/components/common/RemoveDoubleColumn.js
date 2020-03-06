import React from "react";
import removeBtnImg from "../../img/removeBtn.png";

function RemoveDoubleColumnBtn({ label, placeholder, onClick, index }) {
  return (
    <div className='form-element--remove-double'>
      <img src={removeBtnImg} className='form-element--remove-double-img' alt='Remove' onClick={onClick} id={index} />
    </div>
  );
}

export default RemoveDoubleColumnBtn;
