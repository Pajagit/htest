import React from "react";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const Confirm = (title, msg, reject, confirm, handleConfirm) =>
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className="confirmation-dialog noselect">
          <div className="confirmation-dialog--title">{title}</div>
          <div className="confirmation-dialog--message">{msg}</div>
          <div className="confirmation-dialog--buttons">
            <div className="confirmation-dialog--buttons--reject" onClick={onClose}>
              <div>{reject}</div>
            </div>
            <div
              className="confirmation-dialog--buttons--confirm"
              onClick={e => {
                onClose(e);
                handleConfirm(e);
              }}
            >
              <div>{confirm}</div>
            </div>
          </div>
        </div>
      );
    }
  });
export default Confirm;
