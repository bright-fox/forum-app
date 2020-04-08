import React from "react";
import { unmountModal } from "../utils";
import Notification from "./Notification";
import { errorStatus, successStatus } from "../utils/variables";

const Modal = ({ title, content, actions, msg, status }) => {
  document.querySelector("body").classList.add("modal__body-open");

  return (
    <div onClick={unmountModal} className="ui dimmer modals active">
      <div onClick={e => e.stopPropagation()} className="ui modal active">
        {title && <div className="header">{title}</div>}
        {/* Notification */}
        {(status === errorStatus || status === successStatus) && <Notification status={status} msg={msg} />}
        {content && <div className="content">{content}</div>}
        {actions && <div className="actions">{actions}</div>}
      </div>
    </div>
  );
};
export default Modal;
