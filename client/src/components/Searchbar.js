import React, { useRef } from "react";
import ReactDOM from "react-dom";
import useForm from "../hooks/useForm";

const SearchBar = () => {
  const formRef = useRef(null);

  const submitCallback = inputs => {
    console.log(inputs);
  };
  const { inputs, handleInputChange, handleSubmit } = useForm({ query: "" }, submitCallback);
  return (
    <form className="ui form" onSubmit={handleSubmit} ref={formRef}>
      <div className="ui icon input">
        <input
          type="text"
          name="query"
          placeholder="Search..."
          className="m-0 ui icon input"
          value={inputs.query}
          onChange={handleInputChange}
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
