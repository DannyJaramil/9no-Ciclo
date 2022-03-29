import React, { useCallback, useEffect } from "react";
import { Prompt, useHistory, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import _ from "lodash";

import { userTypeSchema } from "../../../../helpers/validations";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  CREATE_USER_TYPE,
  UPDATE_USER_TYPE,
} from "../../../../graphql/mutations/userType.mutations";
import {
  GET_USER_TYPE,
  GET_USER_TYPES,
} from "../../../../graphql/queries/userType.queries";

export const NewUserType = () => {
  let { id } = useParams();
  let history = useHistory();

  const { register, handleSubmit, formState, errors, reset } = useForm({
    defaultValues: {
      name: "",
    },
    resolver: yupResolver(userTypeSchema),
  });

  const { data } = useQuery(GET_USER_TYPE, {
    variables: { id },
    skip: !id,
  });

  const [createUserType, { loading }] = useMutation(CREATE_USER_TYPE, {
    refetchQueries: [{ query: GET_USER_TYPES }],
  });

  const [updateUserType, { loading: updating }] = useMutation(
    UPDATE_USER_TYPE,
    {
      refetchQueries: [{ query: GET_USER_TYPES }],
    }
  );

  const loadingUserType = useCallback(
    (data) => {
      if (data) {
        let defaultValues = {
          name: data.userType.name,
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
    loadingUserType(data);
  }, [data, loadingUserType]);

  useEffect(() => {
    if (shouldBlockNavigation()) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = undefined;
    }
  }, [formState, shouldBlockNavigation]);

  const submitForm = (dataForm) => {
    if (id)
      updateUserType({
        variables: { userType: dataForm, id },
      })
        .then((res) => {
          const { updateUserType } = res.data;
          if (updateUserType?.id) {
            toast.success(updateUserType?.message);
            history.push(`/panel/configuracion`);
          }
        })
        .catch((err) => {
          console.log(`[ERROR] ${err}`);
        });
    else
      createUserType({ variables: { userType: dataForm } })
        .then((res) => {
          const { createUserType } = res.data;
          if (createUserType?.id) {
            toast.success(createUserType?.message);
            history.push(`/panel/configuracion`);
          } else {
            toast.error(createUserType?.message);
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
                    Nombre del Tipo de Usuario
                  </label>
                  <div className="col">
                    <input
                      type="text"
                      name="name"
                      ref={register()}
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      aria-label="Nombre del Tipo de Usuario"
                      autoComplete="off"
                      autoFocus={true}
                    />
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
                        id ? history.push("/panel/configuracion") : reset()
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
            <h6 className="mb-4">Registro de Tipos de Usuario</h6>
            <p>Descripción.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
