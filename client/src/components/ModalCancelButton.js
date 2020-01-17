import React from "react";
import { unmountModal } from "../utils";

const ModalCancelButton = () => {
  return (
    <button className="ui button red mini" onClick={unmountModal} type="button">
      Cancel
    </button>
  );
};

export default ModalCancelButton;
