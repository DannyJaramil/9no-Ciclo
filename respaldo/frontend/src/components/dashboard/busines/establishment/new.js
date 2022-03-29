import React, { useCallback, useEffect } from "react";
import { Prompt, useHistory, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import _ from "lodash";

import { establishmentSchema } from "../../../../helpers/validations";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  CREATE_ESTABLISHMENT,
  UPDATE_ESTABLISHMENT,
} from "../../../../graphql/mutations/establishment.mutations";
import {
  GET_ESTABLISHMENT,
  GET_ESTABLISHMENTS,
} from "../../../../graphql/queries/establishment.queries";

import { ListingEmissionPoints } from "../emissionPoint/listing";

export const NewEstablishment = () => {
  let { id } = useParams();
  let history = useHistory();

  const { register, handleSubmit, formState, errors, reset } = useForm({
    resolver: yupResolver(establishmentSchema),
  });

  const { data } = useQuery(GET_ESTABLISHMENT, {
    variables: { id },
    skip: !id,
  });

  const [createEstablishment, { loading }] = useMutation(CREATE_ESTABLISHMENT, {
    refetchQueries: [
      {
        query: GET_ESTABLISHMENTS,
        variables: { queries: {} },
      },
    ],
  });

  const [updateEstablishment, { loading: updating }] = useMutation(
    UPDATE_ESTABLISHMENT,
    {
      refetchQueries: [
        {
          query: GET_ESTABLISHMENTS,
          variables: { queries: {} },
        },
      ],
    }
  );

  const loadingPaymentType = useCallback(
    (data) => {
      if (data) {
        let defaultValues = {
          address: data.establishment.address,
          city: data.establishment.city,
          code: data.establishment.code,
          commercialName: data.establishment.commercialName,
          email: data.establishment.email,
          phone: data.establishment.phone,
          province: data.establishment.province,
          shortName: data.establishment.shortName,
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
    loadingPaymentType(data);
  }, [data, loadingPaymentType]);

  useEffect(() => {
    if (shouldBlockNavigation()) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = undefined;
    }
  }, [formState, shouldBlockNavigation]);

  const submitForm = (dataForm) => {
    if (dataForm.logo) {
      let logo = dataForm.logo[0];
      dataForm.logo = logo;
    }

    if (id) {
      let previousLogo = data.establishment.logo;
      dataForm.previousLogo = previousLogo;
    }

    if (id)
      updateEstablishment({
        variables: { establishment: dataForm, id },
      })
        .then((res) => {
          const { updateEstablishment } = res.data;
          if (updateEstablishment?.id) {
            toast.success(updateEstablishment?.message);
            history.push(`/panel/negocio`);
          }
        })
        .catch((err) => {
          console.log(`[ERROR] ${err}`);
        });
    else
      createEstablishment({
        variables: { establishment: dataForm },
      })
        .then((res) => {
          const { createEstablishment } = res.data;
          if (createEstablishment?.id) {
            toast.success(createEstablishment?.message);
            history.push(
              `/panel/negocio/establecimiento/modificar/${createEstablishment.id}`
            );
          } else {
            toast.error(createEstablishment?.message);
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
                    Nombre Comercial
                  </label>
                  <div className="col">
                    <input
                      type="text"
                      name="commercialName"
                      ref={register()}
                      className={`form-control ${
                        errors.commercialName ? "is-invalid" : ""
                      }`}
                      aria-label="Nombre Comercial"
                      autoComplete="off"
                      autoFocus={true}
                    />
                  </div>
                </div>

                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">Nombre Corto</label>
                  <div className="col">
                    <input
                      type="text"
                      name="shortName"
                      ref={register()}
                      className={`form-control ${
                        errors.shortName ? "is-invalid" : ""
                      }`}
                      aria-label="Nombre Corto"
                      autoComplete="off"
                    />
                  </div>
                </div>

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
                    />
                  </div>
                </div>

                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">
                    Logo del establecimiento
                  </label>
                  <div className="col">
                    {data?.establishment?.logo && (
                      <img
                        src={
                          process.env.REACT_APP_CLOUDINARY_URI +
                          data.establishment.logo
                        }
                        className="img-fluid"
                        alt={data.establishment.commercialName}
                      />
                    )}

                    <input
                      type="file"
                      name="logo"
                      ref={register()}
                      className={`form-control ${
                        errors.logo ? "is-invalid" : ""
                      }`}
                      aria-label="Logo del establecimiento"
                      autoComplete="off"
                      accept="image/*"
                    />
                    {errors.logo && (
                      <div className="invalid-feedback">
                        {errors.logo.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">Provincia</label>
                  <div className="col">
                    <input
                      type="text"
                      name="province"
                      ref={register()}
                      className={`form-control ${
                        errors.province ? "is-invalid" : ""
                      }`}
                      aria-label="Provincia"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">Ciudad</label>
                  <div className="col">
                    <input
                      type="text"
                      name="city"
                      ref={register()}
                      className={`form-control ${
                        errors.city ? "is-invalid" : ""
                      }`}
                      aria-label="Ciudad"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <label className="col-3 col-form-label">Dirección</label>
                  <div className="col">
                    <textarea
                      name="address"
                      ref={register()}
                      className={`form-control ${
                        errors.address ? "is-invalid" : ""
                      }`}
                      rows="2"
                    ></textarea>
                  </div>
                </div>

                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">Teléfono</label>
                  <div className="col-6">
                    <input
                      type="text"
                      name="phone"
                      ref={register()}
                      className={`form-control ${
                        errors.phone ? "is-invalid" : ""
                      }`}
                      aria-label="Teléfono"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">Correo</label>
                  <div className="col-6">
                    <div className="input-group">
                      <span className="input-group-text" id="addon-mail-1">
                        @
                      </span>
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        ref={register()}
                        aria-label="Correo"
                        aria-describedby="addon-mail-1"
                        autoComplete="off"
                      />
                    </div>
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
                        id ? history.push("/panel/negocio") : reset()
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
            <h6 className="mb-4">Registro de Establecimientos</h6>
            <p>Descripción.</p>
          </div>
        </div>
      </div>

      {id && (
        <div className="row mt-5">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <ListingEmissionPoints />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
