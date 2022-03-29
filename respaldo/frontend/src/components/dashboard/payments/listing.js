import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../others/Pagination";

import { GET_PAYMENTS } from "../../../graphql/queries/payment.queries";

const Payments = (props) => {
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
  } = usePagination(10);

  const { data } = useQuery(GET_PAYMENTS, {
    variables: {
      offset: currentPage,
      limit: itemsPerPage,
      queries: queries,
    },
    fetchPolicy: "cache-and-network"
  });

  useEffect(() => {
    if (data) setTotal(data.payments.total);
    // eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    history.push({
      pathname: "/panel/pagos",
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
                <div className="input-group-text"><i className="bi bi-search" /></div>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar..."
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
              <div className="col-4">Cliente</div>
              <div className="col-3">Nro. Factura</div>
              <div className="col-2">Detalles</div>
              <div className="col-2">Método</div>
              <div className="col-1">Monto</div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
      { data?.payments?.payments && data?.payments?.payments.length > 0 
         ?
          data?.payments?.payments.map((payment, index) => {
            var created_at = new Date(parseInt(payment.created_at));
            var paid_at = new Date(parseInt(payment.payment_date));
            return (
              <div className="col-12" key={payment.id}>
                <div className="user_item mb-3">
                  <div className="row align-items-center">
                    <div className="col-4">
                      { payment.invoice.customer.reference ? payment.invoice.customer.reference?.business_name : 'Consumidor final' }  
                    </div> 
                    <div className="col-3">
                      <b>{ payment.invoice.invoice_number }</b>  
                    </div>  
                    <div className="col-2">
                      <div className="timestamp">
                        Creado el:{" "}
                        <span>{`${created_at.getDate()}/${created_at.getMonth()}/${created_at.getFullYear()}`}</span>
                      </div>
                      <div className="timestamp">
                        Fecha pago:{" "}
                        <span>{`${paid_at.getDate()}/${paid_at.getMonth()}/${paid_at.getFullYear()}`}</span>
                      </div>
                    </div> 
                    <div className="col-2">
                      { payment.method.name }
                    </div>
                    <div className="col-1">
                      ${ parseFloat(payment.amount).toFixed(2) }
                    </div>
                  </div>   
                </div>
              </div>
            )
          })
          :(
            <div className="col">
              <hr className="mt-2 mb-4" />
              <div className="empty_box">
                <span className="description">
                  No se han encontrado elementos para mostrar.
                </span>
              </div>
            </div>
          )
        }
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
  )
};
  
export default Payments;