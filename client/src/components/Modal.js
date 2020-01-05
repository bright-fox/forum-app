import React from "react";

const Modal = ({ onDismiss, title, content, actions }) => {
  document.querySelector("body").classList.add("modal__body-open");

  return (
    <div onClick={onDismiss} className="ui dimmer modals active">
      <div onClick={e => e.stopPropagation()} className="ui modal active">
        <div className="header">{title}</div>
        <div className="content">{content}</div>
        {actions ? <div className="actions">{actions}</div> : ""}
      </div>
    </div>
  );
};
export default Modal;
