import React, { useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";

import { useForm } from "react-hook-form";

import { Prompt, useHistory, useParams } from "react-router-dom";
import _ from "lodash";

import { userSchema } from "../../../helpers/validations";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  ADD_USER,
  UPDATE_USER,
} from "../../../graphql/mutations/user.mutations";
import {
  GET_CUSTOMER,
  GET_CUSTOMERS,
} from "../../../graphql/queries/user.queries";
import { GET_USER_TYPES } from "../../../graphql/queries/userType.queries";

const NewCustomer = (props) => {
  let { id } = useParams();
  let history = useHistory();

  const { register, handleSubmit, formState, errors, reset } = useForm({
    defaultValues: {
      business_name: "",
      tradename: "",
      user_type: "",
      dni_type: "Cédula de Identidad",
      dni: "",
      address: "",
      phone_number: "",
      special_taxpayer: false,
      aditional_information: "",
      email: "",
    },
    resolver: yupResolver(userSchema),
  });

  const { data } = useQuery(GET_CUSTOMER, {
    variables: { id },
    skip: !id,
  });

  const { data: userTypes } = useQuery(GET_USER_TYPES);

  const [createUser, { loading }] = useMutation(ADD_USER, {
    refetchQueries: [
      {
        query: GET_CUSTOMERS,
        variables: { offset: 1, limit: 10, queries: {} },
      },
    ],
  });

  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER, {
    refetchQueries: [
      {
        query: GET_CUSTOMERS,
        variables: { offset: 1, limit: 10, queries: {} },
      },
    ],
  });

  useEffect(() => {
    loadingCustomer(data);
    // eslint-disable-next-line
  }, [data]);

  const loadingCustomer = (data) => {
    if (data) {
      let defaultValues = {
        business_name: data.customer.business_name,
        tradename: data.customer.tradename,
        user_type: data.customer.user_type.id,
        dni_type: data.customer.dni_type,
        dni: data.customer.dni,
        address: data.customer.address,
        phone_number: data.customer.phone_number,
        special_taxpayer: data.customer.special_taxpayer,
        aditional_information: data.customer.aditional_information,
        email: data.customer.email,
      };

      reset(defaultValues);
    }
  };

  const submitForm = (dataForm) => {
    if (id)
      updateUser({
        variables: { userUpdated: dataForm, id },
      })
        .then((res) => {
          const { updateUser } = res.data;
          if (updateUser?.id) {
            toast.success(updateUser?.message);
            history.push(`/panel/clientes`);
          }
        })
        .catch((err) => {
          console.log(`[ERROR] ${err}`);
        });
    else
      createUser({ variables: { user: dataForm } })
        .then((res) => {
          const { createUser } = res.data;
          if (createUser?.id) {
            toast.success(createUser?.message);
            history.push(`/panel/clientes`);
          } else {
            toast.error(createUser?.message);
          }
        })
        .catch((err) => {
          console.log(`[ERROR] ${err}`);
        });
  };

  useEffect(() => {
    if (shouldBlockNavigation()) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = undefined;
    }
    // eslint-disable-next-line
  }, [formState]);

  // check if navigation should be blocked
  const shouldBlockNavigation = () => {
    if (formState.isSubmitted) return false;
    return !_.isEmpty(formState.dirtyFields);
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
                    Tipo de Identificación
                  </label>
                  <div className="col">
                    <select
                      className={`form-select form-control ${
                        errors.dni_type ? "is-invalid" : ""
                      }`}
                      name="dni_type"
                      ref={register()}
                      aria-label="Tipo de identificación"
                    >
                      <option>Cédula de Identidad</option>
                      <option>RUC</option>
                    </select>
                  </div>
                </div>

                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">Identificación</label>
                  <div className="col">
                    <input
                      type="text"
                      name="dni"
                      ref={register()}
                      className={`form-control ${
                        errors.dni ? "is-invalid" : ""
                      }`}
                      aria-label="Identificación"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">Razón social</label>
                  <div className="col">
                    <input
                      type="text"
                      name="business_name"
                      ref={register()}
                      className={`form-control ${
                        errors.business_name ? "is-invalid" : ""
                      }`}
                      aria-label="Razón Social"
                      autoComplete="off"
                      autoFocus={true}
                    />
                  </div>
                </div>
                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">
                    Nombre comercial
                  </label>
                  <div className="col">
                    <input
                      type="text"
                      name="tradename"
                      ref={register()}
                      className={`form-control ${
                        errors.tradename ? "is-invalid" : ""
                      }`}
                      aria-label="Nombre comercial"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">
                    Tipo de Usuario
                  </label>
                  <div className="col">
                    <select
                      className={`form-select form-control ${
                        errors.user_type ? "is-invalid" : ""
                      }`}
                      name="user_type"
                      ref={register()}
                      aria-label="Tipo de Usuario"
                    >
                      {userTypes?.userTypes.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mb-4">
                  <label className="col-3 col-form-label">Dirección</label>
                  <div className="col">
                    <textarea
                      className={`form-control ${
                        errors.address ? "is-invalid" : ""
                      }`}
                      rows="2"
                      name="address"
                      ref={register()}
                    ></textarea>
                  </div>
                </div>
                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">Teléfono</label>
                  <div className="col-6">
                    <input
                      type="text"
                      name="phone_number"
                      ref={register()}
                      className={`form-control ${
                        errors.phone_number ? "is-invalid" : ""
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
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        name="email"
                        ref={register()}
                        aria-label="Precio"
                        aria-describedby="addon-mail-1"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label"></label>
                  <div className="col">
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        name="special_taxpayer"
                        ref={register()}
                        className="custom-control-input"
                        id="special_taxpayer_input"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="special_taxpayer_input"
                      >
                        Contribuyente especial
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  <label className="col-3 col-form-label">
                    Información adicional
                  </label>
                  <div className="col">
                    <textarea
                      className={`form-control ${
                        errors.aditional_information ? "is-invalid" : ""
                      }`}
                      rows="2"
                      name="aditional_information"
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
                        id ? history.push("/panel/clientes") : reset()
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
            <h6 className="mb-4">Registro de clientes</h6>
            <p>
              A los clientes registrados en este formulario, posteriormente, se
              les podrá emitir comprobantes electrónicos, enviar comprobantes y
              obtener reportes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCustomer;
