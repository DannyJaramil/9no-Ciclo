import React, { useEffect } from "react";
import { NavLink as Link, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";

import Dropdown from "../../../others/Dropdown";

import { usePagination } from "../../../../hooks/usePagination";
import Pagination from "../../../others/Pagination";

import { GET_INVOICES } from "../../../../graphql/queries/invoice.queries";

const Listing = (props) => {
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

  const { data, error } = useQuery(GET_INVOICES, {
    variables: {
      offset: currentPage,
      limit: itemsPerPage,
      queries: queries,
    },
    fetchPolicy: "cache-and-network"
  });

  useEffect(() => {
    if (data) setTotal(data.invoices.total);
    // eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    history.push({
      pathname: "/panel/facturacion/facturas",
      search: `?${queryStrings}`,
    });
    // eslint-disable-next-line
  }, [queryStrings]);

  useEffect(() => {
    console.log(error);
  }, [error]);

  const getOptions = id => {
    const options = [
      {
        text: 'Editar',
        action: () => history.push({
          pathname: `/panel/facturacion/facturas/editar/${id}`,
        }),
        type: 'text'
      },
      {
        text: 'Borrar',
        action: () => console.log("No implementado"),
        type: 'text'
      },      
      {
        type: 'divider'
      },
      {
        text: 'Autorizar',
        action: () => console.log("No implementado"),
        type: 'text'
      },
      {
        text: 'Enviar por correo',
        action: () => console.log("No implementado"),
        type: 'text'
      },
      {
        type: 'divider'
      },
      {
        text: 'Anular',
        action: () => console.log("No implementado"),
        type: 'text'
      },
      {
        text: 'Crear una copia',
        action: () => console.log("No implementado"),
        type: 'text'
      },
      {
        text: 'Nota de cr??dito',
        action: () => console.log("No implementado"),
        type: 'text'
      },
      {
        text: 'Gu??a de remisi??n',
        action: () => console.log("No implementado"),
        type: 'text'
      },
    ];

    return options;
  };

  const renderCustomerName = data => {
    if(data.reference)
      return `${data.reference.business_name} ${data.reference.tradename ? `(${data.reference.tradename})` : ""}`;

    return 'Consumidor Final'
  };

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
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>
        </div>
        <div className="col text-right">
          <Link to={`/panel/facturacion/facturas/nuevo`} className="btn btn-green">
            Nueva Factura
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="header_list">
            <div className="row">
              <div className="col-4">Info. Cliente</div>
              <div className="col-3">N??mero</div>
              <div className="col-2">Total</div>
              <div className="col-2">Estado</div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        { data?.invoices?.invoices && data?.invoices?.invoices.length > 0 
         ?
          data?.invoices?.invoices.map((invoice, index) => {
            var emission_date = new Date(parseInt(invoice.emission_date));
            return (
              <div className="col-12" key={invoice.id}>
                <div className="user_item mb-3">
                  <div className="row align-items-center">
                    <div className="col">
                      <Link to={`/panel/facturacion/facturas/vista/${invoice.id}`} className="purple">
                        { renderCustomerName(invoice.customer) } 
                      </Link>
                    </div> 
                    <div className="col-3">
                      <b># { invoice.invoice_number }</b>
                      <div className="timestamp">
                        Emitido el:{" "}
                        <span>{`${emission_date.getDate()}/${emission_date.getMonth()}/${emission_date.getFullYear()}`}</span>
                      </div>  
                    </div>  
                    <div className="col-2">
                      ${ parseFloat(invoice.total).toFixed(2) }
                    </div> 
                    <div className="col-2">
                      <span className="status">
                        <i
                          className={`fig ${
                            invoice.pending_balance === 0 ? "active" : "inactive"
                          }`}
                        />
                        { invoice.status }
                      </span>
                    </div>
                    <div className="col-auto">
                      <div className="options text-right">
                        <Link to={`/panel/facturacion/facturas/vista/${invoice.id}`} className="btn btn-secondary mr-2">
                          <i className="bi bi-eye-fill"></i>
                        </Link>
                        <Dropdown options={getOptions(invoice.id)} />
                      </div>
                    </div>
                  </div>   
                </div>
              </div>
            )
          })
          :(
            <div className="col">
              <div className="empty_box">
                <span className="description">
                  No se han encontrado elementos para mostrar.
                </span>
                <Link className="btn btn-secondary" to="/panel/facturacion/facturas/nuevo">
                  A??adir nuevo
                </Link>
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
  );
};

export default Listing;
