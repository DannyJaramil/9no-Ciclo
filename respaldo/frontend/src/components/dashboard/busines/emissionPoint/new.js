import React, { useCallback, useEffect } from "react";
import { Prompt, useHistory, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import _ from "lodash";

import { emissionPointSchema } from "../../../../helpers/validations";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  CREATE_EMISSION_POINT,
  UPDATE_EMISSION_POINT,
} from "../../../../graphql/mutations/emissionPoint.mutations";
import {
  GET_EMISSION_POINT,
  GET_EMISSION_POINTS,
} from "../../../../graphql/queries/emissionPoint.queries";

export const NewEmissionPoint = () => {
  let { establishment, id } = useParams();
  let history = useHistory();

  const { register, handleSubmit, formState, errors, reset } = useForm({
    resolver: yupResolver(emissionPointSchema),
  });

  const { data } = useQuery(GET_EMISSION_POINT, {
    variables: { id, establishment },
    skip: !id,
  });

  const [createEmissionPoint, { loading }] = useMutation(
    CREATE_EMISSION_POINT,
    {
      refetchQueries: [
        {
          query: GET_EMISSION_POINTS,
          variables: { queries: {}, establishment },
        },
      ],
    }
  );

  const [updateEmissionPoint, { loading: updating }] = useMutation(
    UPDATE_EMISSION_POINT,
    {
      refetchQueries: [
        {
          query: GET_EMISSION_POINTS,
          variables: { queries: {}, establishment },
        },
      ],
    }
  );

  const loadingEmissionPoint = useCallback(
    (data) => {
      if (data) {
        let defaultValues = {
          code: data.emissionPoint.code,
          description: data.emissionPoint.description,
        };

        reset(defaultValues);
      }
    },
    [reset]
  );

  const shouldBlockNavigation = useCallback(() => {
    if (formState.isSubmitted) return false;
    return !_.isEmpty(formState.dirtyFields);
  }, [formState.isSubmitted, formState.dirtyFields]);

  useEffect(() => {
    loadingEmissionPoint(data);
  }, [data, loadingEmissionPoint]);

  useEffect(() => {
    if (shouldBlockNavigation()) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = undefined;
    }
  }, [formState, shouldBlockNavigation]);

  const submitForm = (dataForm) => {
    dataForm.establishment = establishment;

    if (id)
      updateEmissionPoint({
        variables: { emissionPoint: dataForm, id },
      })
        .then((res) => {
          const { updateEmissionPoint } = res.data;
          if (updateEmissionPoint?.id) {
            toast.success(updateEmissionPoint?.message);
            history.push(
              `/panel/negocio/establecimiento/modificar/${establishment}`
            );
          }
        })
        .catch((err) => {
          console.log(`[ERROR] ${err}`);
        });
    else
      createEmissionPoint({
        variables: { emissionPoint: dataForm },
      })
        .then((res) => {
          const { createEmissionPoint } = res.data;
          if (createEmissionPoint?.id) {
            toast.success(createEmissionPoint?.message);
            history.push(
              `/panel/negocio/establecimiento/modificar/${establishment}`
            );
          } else {
            toast.error(createEmissionPoint?.message);
          }
        })
        .catch((err) => {
          console.log(`[ERROR] ${err}`);
        });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-8">
          {!formState.isValid &&
          formState.isSubmitted &&
          !formState.isSubmitSuccessful ? (
            <div className="alert alert-danger" role="alert">
              Es necesario llenar o corregir todos los datos{" "}
              <strong>requeridos</strong>
            </div>
          ) : null}

          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit(submitForm)}>
                <Prompt
                  when={shouldBlockNavigation()}
                  message="Existen cambios no guardados, ¿Desea salir?"
                />

                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">Código</label>
                  <div className="col">
                    <input
                      type="text"
                      name="code"
                      ref={register()}
                      className={`form-control ${
                        errors.code ? "is-invalid" : ""
                      }`}
                      aria-label="Código"
                      autoComplete="off"
                      autoFocus={true}
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <label className="col-3 col-form-label">Descripción</label>
                  <div className="col">
                    <textarea
                      name="description"
                      ref={register()}
                      className={`form-control ${
                        errors.description ? "is-invalid" : ""
                      }`}
                      rows="2"
                    ></textarea>
                  </div>
                </div>

                <div className="row">
                  <div className="col-3"></div>
                  <div className="col">
                    <button
                      type="submit"
                      className="btn btn-green mr-3"
                      disabled={loading || updating || (id && !data)}
                    >
                      {loading || updating ? (
                        <div
                          className="spinner-border text-light"
                          role="status"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        "Guardar datos"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        id
                          ? history.push(
                              `/panel/negocio/establecimiento/modificar/${establishment}`
                            )
                          : reset()
                      }
                      className="btn btn-light"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-4">
          <div className="description_box">
            <h6 className="mb-4">Registro de Punto de Emisión</h6>
            <p>Descripción.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
