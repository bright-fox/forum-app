import React from "react";
import { Link } from "react-router-dom";

const Pagination = ({ currPage, maxPage, setCurrPage }) => {
  const createItem = ({ page, isArrow, isDots }) => {
    if (isArrow)
      return (
        <Link
          key={isArrow}
          to="/"
          className="item"
          onClick={e => {
            e.preventDefault();
            setCurrPage(page);
          }}
        >
          <i className={"arrow icon " + isArrow} />
        </Link>
      );

    if (isDots)
      return (
        <Link key={isDots} to="/" className="disabled item" onClick={e => e.preventDefault()}>
          ...
        </Link>
      );

    return (
      <Link
        to="/"
        key={page}
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

  const createPartialItems = (leftBoundary, rightBoundary) => {
    const items = [];
    if (rightBoundary - leftBoundary >= 5) {
      //   items.push(createItem({ page: leftBoundary }));
      items.push(createItem({ page: leftBoundary + 1 }));
      items.push(createItem({ isDots: `dots${leftBoundary}${rightBoundary}` }));
      items.push(createItem({ page: rightBoundary - 1 }));
      items.push(createItem({ page: rightBoundary }));
      return items;
    }

    for (let i = leftBoundary + 1; i <= rightBoundary; i++) {
      items.push(createItem({ page: i }));
    }
    return items;
  };

  const renderPaginationItems = () => {
    let items = [];
    items.push(createItem({ isArrow: "left", page: 1 }));
    items.push(createItem({ page: 1 }));
    items = items.concat(createPartialItems(1, currPage));
    items = items.concat(createPartialItems(currPage, maxPage));
    items.push(createItem({ page: maxPage, isArrow: "right" }));
    return items;
  };
  return <div className="ui pagination menu">{renderPaginationItems()}</div>;
};

export default Pagination;
