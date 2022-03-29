import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Pagination = ({ totalPages, currentPage, changePageHandler, range }) => {
  let pages = [];
  let initialPage = Math.floor((currentPage - 1) / range) * range + 1;
  let lastPage =
    initialPage + (range - 1) >= totalPages
      ? totalPages
      : initialPage + (range - 1);

  for (let index = initialPage; index <= lastPage; index++) {
    if (index === initialPage) {
      pages.push(
        <li
          className={`page-item ${currentPage === 1 && "disabled"}`}
          key={index - 1}
        >
          <Link
            className="page-link"
            to="#"
            onClick={() => changePageHandler(currentPage - 1)}
            aria-label="Previous"
          >
            <span aria-hidden="true">&laquo;</span>
          </Link>
        </li>
      );
    }

    pages.push(
      <li
        className={`page-item ${index === currentPage ? "active" : ""}`}
        key={index}
      >
        <Link
          className="page-link"
          to="#"
          onClick={() => changePageHandler(index)}
        >
          {index}
        </Link>
      </li>
    );

    if (index === lastPage) {
      pages.push(
        <li
          className={`page-item ${currentPage === totalPages && "disabled"}`}
          key={totalPages + 1}
        >
          <Link
            className="page-link"
            to="#"
            onClick={() => changePageHandler(currentPage + 1)}
            aria-label="Next"
          >
            <span aria-hidden="true">&raquo;</span>
          </Link>
        </li>
      );
    }
  }

  return (
    <nav>
      <ul className="pagination justify-content-end">{pages}</ul>
    </nav>
  );
};

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  changePageHandler: PropTypes.func.isRequired,
  range: PropTypes.number,
};

Pagination.defaultProps = {
  range: 5,
};

export default Pagination;
