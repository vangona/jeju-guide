import React from "react";

const Pagination = ({ postsPerPage, totalPosts, currentPage, paginate }) => {
  const pageNumbers = [];
  const lastPageNumber = Math.ceil(totalPosts / postsPerPage);
  for (let i = 1; i <= lastPageNumber; i++) {
    pageNumbers.push(i);
  }
  return (
    <>
      <div className="pagination__container">
        {currentPage !== 1 && (
          <span
            className="pagination__arrow"
            onClick={() => paginate((prev) => prev - 1)}
          >
            ◀
          </span>
        )}
        {pageNumbers.map((number) => (
          <span
            key={number}
            className="pagination__index"
            onClick={() => paginate(number)}
          >
            {number}
          </span>
        ))}
        {currentPage !== lastPageNumber && (
          <span
            className="pagination__arrow"
            onClick={() => paginate((prev) => prev + 1)}
          >
            ▶
          </span>
        )}
      </div>
    </>
  );
};

export default Pagination;
