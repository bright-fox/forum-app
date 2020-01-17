import React, { useRef } from "react";
import ReactDOM from "react-dom";
import useForm from "../hooks/useForm";

const SearchBar = () => {
  const formRef = useRef(null);

  const submitCallback = inputs => {
    if (!inputs.query) return;
  };
  const { inputs, handleInputChange, handleSubmit } = useForm({ query: "" }, submitCallback);
  return (
    <form className="ui form" onSubmit={handleSubmit} ref={formRef}>
      <div className="ui icon input">
        <input
          type="text"
          name="query"
          placeholder="Search..."
          value={inputs.query}
          onChange={handleInputChange}
          className="m-0 ui icon input quarter width"
        />
        <i
          className="search link icon"
          onClick={() => ReactDOM.findDOMNode(formRef.current).dispatchEvent(new Event("submit"))}
        ></i>
      </div>
    </form>
  );
};

export default SearchBar;
