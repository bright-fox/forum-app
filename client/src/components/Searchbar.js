import React, { useRef } from "react";
import ReactDOM from "react-dom";
import useForm from "../hooks/useForm";
import history from "../history";

const SearchBar = ({ initialValue, width }) => {
  const formRef = useRef(null);

  const submitCallback = inputs => {
    if (!inputs.query) return;
    history.push(`/search?q=${inputs.query}&?tab=posts`);
  };
  const { inputs, handleInputChange, handleSubmit } = useForm({ query: initialValue || "" }, submitCallback);
  return (
    <form className="ui form" onSubmit={handleSubmit} ref={formRef}>
      <div className={`ui icon input ${width || " "}`}>
        <input
          type="text"
          name="query"
          placeholder="Search..."
          value={inputs.query}
          onChange={handleInputChange}
          className="m-0 ui icon input"
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
