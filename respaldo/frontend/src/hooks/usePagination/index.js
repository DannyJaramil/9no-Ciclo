import { useState } from "react";
import { useLocation } from "react-router-dom";
import * as QueryString from "query-string";

export const usePagination = (
  maxItemsPerPage = 10,
  totalItems = 0,
  initialPage = 1
) => {
  let { search } = useLocation();
  const { page, limit, search: SearchString } = QueryString.parse(search);

  const [queries, setQueries] = useState({
    search: SearchString || null,
  });
  const [itemsPerPage, setItemsPerPage] = useState(
    parseInt(limit) || maxItemsPerPage
  );
  const [total, setTotal] = useState(totalItems);
  const [currentPage, setCurrentPage] = useState(parseInt(page) || initialPage);

  const isPaginating = total > itemsPerPage;

  const totalPages = Math.ceil(total / itemsPerPage);

  let queriesToStringify = {
    page: currentPage,
    limit: itemsPerPage,
  };

  if (queries.search) {
    queriesToStringify.search = queries.search;
  }

  let queryStrings = QueryString.stringify(queriesToStringify);

  const setSearch = (text) =>
    setQueries((state) => ({ ...state, search: text }));

  return {
    setTotal,
    setItemsPerPage,
    setCurrentPage,
    setSearch,
    isPaginating,
    totalPages,
    currentPage,
    itemsPerPage,
    queries,
    queryStrings,
  };
};
