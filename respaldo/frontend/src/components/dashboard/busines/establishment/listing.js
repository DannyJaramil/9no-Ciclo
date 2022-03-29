import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";

import EmptyBox from "../../../others/EmptyBox";

import { GET_ESTABLISHMENTS } from "../../../../graphql/queries/establishment.queries";

export const ListingEstablishments = () => {
  const { data, refetch } = useQuery(GET_ESTABLISHMENTS, {
    variables: { queries: {} },
  });

  return (
    <>
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
                defaultValue=""
                onChange={(e) =>
                  refetch({
                    queries: {
                      search: e.target.value,
                    },
                  })
                }
              />
            </div>
          </form>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="header_list">
            <div className="row">
              <div className="col-4">Info. Establecimiento</div>
              <div className="col-3">Dirección</div>
              <div className="col-3">Detalles</div>
              <div className="col text-right">Acciones</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {data?.establishments?.length === 0 && (
          <div className="col">
            <EmptyBox to="/panel/negocio/establecimiento/nuevo" />
          </div>
        )}

        {data?.establishments.map((establishment) => {
          var createdAt = new Date(parseInt(establishment.createdAt));
          var updatedAt = new Date(parseInt(establishment.updatedAt));
          return (
            <div className="col-12" key={establishment.id}>
              <div className="user_item mb-3">
                <div className="row align-items-center">
                  <div className="col-4">
                    <span className="name">{establishment.commercialName}</span>
                    <span className="dni">CÓDIGO: {establishment.code}</span>
                    <span className="tradename">
                      -{" "}
                      {establishment.shortName
                        ? establishment.shortName
                        : "N/D"}
                    </span>

                    <span className="d-block">{establishment.email}</span>
                    <span>{establishment.phone}</span>
                  </div>

                  <div className="col-3">
                    <span className="name">
                      {establishment.province} - {establishment.city}
                    </span>
                    <span className="">{establishment.address}</span>
                  </div>

                  <div className="col-3">
                    <div className="timestamp">
                      Creado el:{" "}
                      <span>{`${createdAt.getDate()}/${createdAt.getMonth()}/${createdAt.getFullYear()}`}</span>
                    </div>
                    <div className="timestamp">
                      Modificado el:{" "}
                      <span>{`${updatedAt.getDate()}/${updatedAt.getMonth()}/${updatedAt.getFullYear()}`}</span>
                    </div>
                  </div>
                  <div className="col">
                    <div className="options text-right">
                      <Link
                        to={`/panel/negocio/establecimiento/modificar/${establishment.id}`}
                      >
                        <button
                          type="button"
                          className="btn btn-secondary mr-2"
                        >
                          <i className="bi bi-pencil-fill" />
                        </button>
                      </Link>

                      <Link
                        to={`/panel/negocio/${establishment.id}/punto-emision/nuevo`}
                      >
                        <button
                          type="button"
                          className="btn btn-secondary mr-2"
                        >
                          <i className="bi bi-shop" />
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
    </>
  );
};
