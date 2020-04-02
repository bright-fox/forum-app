import React from "react";
import { unmountModal } from "../utils";
import ErrorMessage from "./ErrorMessage";

const Modal = ({ title, content, actions, err, errMsg }) => {
  document.querySelector("body").classList.add("modal__body-open");

  return (
    <div onClick={unmountModal} className="ui dimmer modals active">
      <div onClick={e => e.stopPropagation()} className="ui modal active">
        {title && <div className="header">{title}</div>}
        {/* ErrorMessage */}
        {err && <ErrorMessage errMsg={errMsg} />}
        {content && <div className="content">{content}</div>}
        {actions && <div className="actions">{actions}</div>}
      </div>
    </div>
  );
};
export default Modal;
