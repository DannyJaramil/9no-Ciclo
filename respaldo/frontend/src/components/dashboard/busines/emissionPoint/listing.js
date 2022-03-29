import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import EmptyBox from "../../../others/EmptyBox";

import { GET_EMISSION_POINTS } from "../../../../graphql/queries/emissionPoint.queries";

export const ListingEmissionPoints = () => {
  let { id } = useParams();

  const { data, refetch } = useQuery(GET_EMISSION_POINTS, {
    variables: {
      queries: {},
      establishment: id,
    },
  });

  return (
    <>
      <div className="row mb-4 justify-content-between">
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

        <Link to={`/panel/negocio/${id}/punto-emision/nuevo`}>
          <button type="button" className="btn btn-primary">
            Nuevo Punto de Emisión
          </button>
        </Link>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="header_list">
            <div className="row">
              <div className="col-6">Info. Punto de Emisión</div>
              <div className="col-4">Detalles</div>
              <div className="col text-right">Acciones</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {data?.emissionPoints?.length === 0 && (
          <div className="col">
            <EmptyBox to={`/panel/negocio/${id}/punto-emision/nuevo`} />
          </div>
        )}

        {data?.emissionPoints.map((emissionPoint) => {
          var createdAt = new Date(parseInt(emissionPoint.createdAt));
          var updatedAt = new Date(parseInt(emissionPoint.updatedAt));
          return (
            <div className="col-12" key={emissionPoint.id}>
              <div className="user_item mb-3">
                <div className="row align-items-center">
                  <div className="col-6">
                    <span className="dni">CÓDIGO: {emissionPoint.code}</span>
                    <span className="name">{emissionPoint.description}</span>
                  </div>

                  <div className="col-4">
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
                        to={`/panel/negocio/${id}/punto-emision/modificar/${emissionPoint.id}`}
                      >
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
    </>
  );
};
