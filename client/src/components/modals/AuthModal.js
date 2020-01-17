import React from "react";
import Modal from "../Modal";
import LoginButton from "../LoginButton";
import SignUpButton from "../SignUpButton";

const AuthModal = () => {
  const renderContent = () => {
    return (
      <div className="ui segment no-border">
        <div className="ui two column very relaxed centered stackable grid">
          <div className="middle aligned column">
            <p className="bold">
              You want more out of this experience? Sign up for free and join the communities that share your interests
              and passions!
            </p>
            <SignUpButton />
          </div>
          <div className="middle aligned column">
            <p className="bold">You already have an account? Login and share your thoughts with your communities!</p>
            <LoginButton />
          </div>
        </div>
        <div className="ui vertical divider">OR</div>
      </div>
    );
  };
  return <Modal title={<h1>Authentication</h1>} content={renderContent()} />;
};

export default AuthModal;
