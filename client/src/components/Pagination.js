import React from "react";
import { createArrow, createPaginationItem, createDots } from "../utils";

const Pagination = ({ currPage, maxPage, setCurrPage, marginTop }) => {
  const createLeftSide = () => {
    const leftItems = [];
    if (currPage - 1 === 0) return leftItems;
    if (currPage - 1 === 1) return createPaginationItem(currPage - 1, currPage, () => setCurrPage(currPage - 1))
    leftItems.push(createDots("leftDots"));
    leftItems.push(createPaginationItem(currPage - 1, currPage, () => setCurrPage(currPage - 1)));
    return leftItems;
  }
  const createRightSide = () => {
    const rightItems = [];
    if (maxPage - currPage === 0) return rightItems;
    if (maxPage - currPage === 1) return createPaginationItem(currPage + 1, currPage, () => setCurrPage(currPage + 1))
    rightItems.push(createPaginationItem(currPage + 1, currPage, () => setCurrPage(currPage + 1)));
    rightItems.push(createDots("rightDots"));
    return rightItems;
  }

  return (
    <div style={{ marginTop }} className="ui pagination menu">
      {createArrow("left", () => setCurrPage(1))}
      {createLeftSide()}
      {createPaginationItem(currPage, currPage, () => setCurrPage(currPage))}
      {createRightSide()}
      {createArrow("right", () => setCurrPage(maxPage))}
    </div>)
};

export default Pagination;
