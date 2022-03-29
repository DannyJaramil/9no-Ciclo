import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../others/Pagination";
import EmptyBox from "../../others/EmptyBox";

import { GET_CUSTOMERS } from "../../../graphql/queries/user.queries";

const ListingCustomers = (props) => {
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
  } = usePagination();

  const { data, error } = useQuery(GET_CUSTOMERS, {
    variables: {
      offset: currentPage,
      limit: itemsPerPage,
      queries: queries,
    },
    fetchPolicy: "cache-and-network"
  });

  useEffect(() => {
    if (data) setTotal(data.customers.total);
    console.log(error)
    // eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    history.push({
      pathname: "/panel/clientes",
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
        <div className="col-12">
          <div className="header_list">
            <div className="row">
              <div className="col-5">Info. Cliente</div>
              <div className="col-2">Contacto</div>
              <div className="col-3">Detalles</div>
              <div className="col text-right">Acciones</div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        {data?.customers?.total === 0 && (
          <div className="col">
            <EmptyBox to={queries?.search ? "" : "/panel/clientes/nuevo"} />
          </div>
        )}

        {data?.customers?.users.map((customer, index) => {
          var created_at = new Date(parseInt(customer.created_at));
          var modified_at = new Date(parseInt(customer.modified_at));
          return (
            <div className="col-12" key={customer.id}>
              <div className="user_item mb-3">
                <div className="row align-items-center">
                  <div className="col-5">
                    <span className="name">{customer.business_name}</span>
                    <small className="font-weight-bold text-muted d-block">
                      {customer.user_type.name}
                    </small>
                    <span className="dni">DNI: {customer.dni}</span>
                    <span className="tradename">
                      - {customer.tradename ? customer.tradename : "N/D"}
                    </span>
                  </div>
                  <div className="col-2">{customer.phone_number}</div>
                  <div className="col-3">
                    <div className="timestamp">
                      Creado el:{" "}
                      <span>{`${created_at.getDate()}/${created_at.getMonth()}/${created_at.getFullYear()}`}</span>
                    </div>
                    <div className="timestamp">
                      Modificado el:{" "}
                      <span>{`${modified_at.getDate()}/${modified_at.getMonth()}/${modified_at.getFullYear()}`}</span>
                    </div>
                  </div>
                  <div className="col">
                    <div className="options text-right">
                      <Link to={`/panel/clientes/modificar/${customer.id}`}>
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

export default ListingCustomers;
