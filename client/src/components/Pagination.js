import React from "react";
import { Link } from "react-router-dom";

const Pagination = ({ currPage, maxPage, setCurrPage }) => {
  const createItem = (page, type, key) => {
    if (type === "left" || type === "right")
      return (
        <Link
          key={key}
          to="/"
          className="item"
          onClick={e => {
            e.preventDefault();
            type === "left" ? setCurrPage(1) : setCurrPage(maxPage);
          }}
        >
          <i className={"arrow icon " + type} />
        </Link>
      );

    if (type === "dots")
      return (
        <Link key={key} to="/" className="disabled item" onClick={e => e.preventDefault()}>
          ...
        </Link>
      );

    return (
      <Link
        to="/"
        key={key}
        className={"item " + (page === currPage ? "active" : "")}
        onClick={e => {
          e.preventDefault();
          setCurrPage(page);
        }}
      >
        {page}
      </Link>
    );
  };

  const renderPaginationItems = () => {
    const items = [];
    // check for some cases [1 _2_ 3 4 5]
    items.push(createItem(1, "left", "start"));
    for (let i = 1; i <= maxPage; i++) {
      items.push(createItem(i, "page", i));
    }
    items.push(createItem(maxPage, "right", "end"));
    return items;
  };
  return <div className="ui pagination menu">{renderPaginationItems()}</div>;
};

export default Pagination;
