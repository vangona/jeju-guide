import React from 'react';

interface PaginationProps {
  postsPerPage: string;
  totalPosts: number;
  currentPage: number;
  handlePageChange: (newPage: number) => void;
}

const Pagination = ({
  postsPerPage,
  totalPosts,
  currentPage,
  handlePageChange,
}: PaginationProps) => {
  const pageNumbers = [];
  const lastPageNumber = Math.ceil(totalPosts / parseInt(postsPerPage));
  for (let i = 1; i <= lastPageNumber; i++) {
    pageNumbers.push(i);
  }
  return (
    <>
      <div className='pagination__container'>
        {currentPage !== 1 && (
          <span
            className='pagination__arrow'
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ◀
          </span>
        )}
        {pageNumbers.map((number) => (
          <span
            key={number}
            className='pagination__index'
            onClick={() => handlePageChange(number)}
          >
            {number}
          </span>
        ))}
        {currentPage !== lastPageNumber && (
          <span
            className='pagination__arrow'
            onClick={() => handlePageChange(currentPage + 1)}
          >
            ▶
          </span>
        )}
      </div>
    </>
  );
};

export default Pagination;
