import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../others/Pagination";
import EmptyBox from "../../others/EmptyBox";

import { GET_PRODUCTS } from "../../../graphql/queries/product.queries";

const ListingProducts = (props) => {
  let history = useHistory();

  const {
    setTotal,
    setCurrentPage,
    setSearch,
    isPaginating,
    totalPages,
    currentPage,
    itemsPerPage,
    queries,
    queryStrings,
  } = usePagination(9);

  const { data } = useQuery(GET_PRODUCTS, {
    variables: {
      offset: currentPage,
      limit: itemsPerPage,
      queries: queries,
    },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (data) setTotal(data.products.total);
    // eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    history.push({
      pathname: "/panel/productos/",
      search: `?${queryStrings}`,
    });
    // eslint-disable-next-line
  }, [queryStrings]);

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-4">
          <form className="search_form">
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text">
                  <i className="bi bi-search" />
                </div>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar..."
                defaultValue={queries?.search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>
        </div>
      </div>
      <div className="row">
        {data?.products?.total === 0 && (
          <div className="col">
            <EmptyBox to={queries?.search ? "" : "/panel/productos/nuevo"} />
          </div>
        )}

        {data?.products?.products.map((product, index) => {
          return (
            <div className="col-4 mb-4" key={index}>
              <div className="product_item">
                <div className="features">
                  <span className="type">{product.product_type}:</span>
                  <span className="code">#{product.code}</span>
                </div>
                <div className="description">{product.description}</div>
                <div className="tags">
                  <span className="tag_item">#hosting</span>
                  <span className="tag_item">#anual</span>
                  <span className="tag_item">#servicio</span>
                </div>
                <div className="footer">
                  <div className="row align-items-center">
                    <div className="col-7">
                      <span className="price">
                        ${parseFloat(product.prices[0].value).toFixed(2)}
                      </span>
                      <span className="status">
                        <i
                          className={`fig ${
                            product.status ? "active" : "inactive"
                          }`}
                        />
                        {product.status ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <div className="col">
                      <div className="options text-right">
                        <Link to={`/panel/productos/modificar/${product.id}`}>
                          <button
                            type="button"
                            className="btn btn-secondary mr-2"
                          >
                            <i className="bi bi-pencil-fill" />
                          </button>
                        </Link>
                        <button type="button" className="btn btn-secondary">
                          <i className="bi bi-trash-fill" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="row">
        <div className="col">
          {isPaginating && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              changePageHandler={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingProducts;
