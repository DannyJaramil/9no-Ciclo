import React, { useCallback, useEffect } from "react";
import { Prompt, useHistory, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import _ from "lodash";

import { taxSchema } from "../../../../helpers/validations";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  CREATE_TAX,
  UPDATE_TAX,
} from "../../../../graphql/mutations/tax.mutations";
import { GET_TAX, GET_TAXES } from "../../../../graphql/queries/tax.queries";
import { taxTypes } from "../../../../helpers/constants";

const defaultValues = {
  name: "",
  type: "",
  percentage: 0,
  description: "",
};

export const NewTax = () => {
  let { id } = useParams();
  let history = useHistory();

  const { register, handleSubmit, formState, errors, reset } = useForm({
    defaultValues,
    resolver: yupResolver(taxSchema),
  });

  const { data } = useQuery(GET_TAX, {
    variables: { id },
    skip: !id,
  });

  const [createTax, { loading }] = useMutation(CREATE_TAX, {
    refetchQueries: [{ query: GET_TAXES }],
  });

  const [updateTax, { loading: updating }] = useMutation(UPDATE_TAX, {
    refetchQueries: [{ query: GET_TAXES }],
  });

  const loadingTax = useCallback(
    (data) => {
      if (data) {
        let defaultValues = {
          name: data.tax.name,
          type: data.tax.type,
          description: data.tax.description,
          percentage: data.tax.percentage,
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
    loadingTax(data);
  }, [data, loadingTax]);

  useEffect(() => {
    if (shouldBlockNavigation()) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = undefined;
    }
  }, [formState, shouldBlockNavigation]);

  const submitForm = (dataForm) => {
    dataForm.percentage = dataForm.percentage / 100;
    if (id)
      updateTax({
        variables: { tax: dataForm, id },
      })
        .then((res) => {
          const { updateTax } = res.data;
          if (updateTax?.id) {
            toast.success(updateTax?.message);
            history.push(`/panel/configuracion`);
          }
        })
        .catch((err) => {
          console.log(`[ERROR] ${err}`);
        });
    else
      createTax({ variables: { tax: dataForm } })
        .then((res) => {
          const { createTax } = res.data;
          if (createTax?.id) {
            toast.success(createTax?.message);
            history.push(`/panel/configuracion`);
          } else {
            toast.error(createTax?.message);
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
                  <label className="col-3 col-form-label">
                    Nombre del Impuesto
                  </label>
                  <div className="col">
                    <input
                      type="text"
                      name="name"
                      ref={register()}
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      aria-label="Nombre del Impuesto"
                      autoComplete="off"
                      autoFocus={true}
                    />
                  </div>
                </div>

                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">
                    Tipo de Impuesto
                  </label>
                  <div className="col">
                    <select
                      className={`form-select form-control ${
                        errors.type ? "is-invalid" : ""
                      }`}
                      name="type"
                      ref={register()}
                      aria-label="Tipo de Impuesto"
                    >
                      {taxTypes.map((item, index) => (
                        <option key={index} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">Porcentaje</label>
                  <div className="col-5">
                    <div className="input-group">
                      <span className="input-group-text" id="addon-dollar-2">
                        %
                      </span>
                      <input
                        type="number"
                        className={`form-control ${
                          errors.percentage ? "is-invalid" : ""
                        }`}
                        name="percentage"
                        ref={register()}
                        aria-label="Porcentaje"
                        aria-describedby="addon-dollar-2"
                        autoComplete="off"
                      />
                    </div>
                    <div className="form-text">
                      Valor del Impuesto (1 al 100%)
                    </div>
                  </div>
                </div>

                <div className="row mb-4">
                  <label className="col-3 col-form-label">Descripción</label>
                  <div className="col">
                    <textarea
                      className={`form-control ${
                        errors.description ? "is-invalid" : ""
                      }`}
                      rows="2"
                      name="description"
                      ref={register()}
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
                          ? history.push("/panel/configuracion")
                          : reset(defaultValues)
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
            <h6 className="mb-4">Registro de Impuestos</h6>
            <p>Descripción.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
