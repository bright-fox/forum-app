import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ show, onDismiss, title, content, actions }) => {
  const isActive = show ? "active" : "";

  return ReactDOM.createPortal(
    <div onClick={onDismiss} className={`ui dimmer modals ${isActive}`}>
      <div onClick={e => e.stopPropagation()} className={`ui modal ${isActive}`}>
        <div className="header">{title}</div>
        <div className="content">{content}</div>
        {actions ? <div className="actions">{actions}</div> : ""}
      </div>
    </div>,
    document.querySelector("#modal")
  );
};
export default Modal;
