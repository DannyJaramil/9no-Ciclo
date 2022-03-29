import React, { useCallback, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";

import { useForm, useFieldArray } from "react-hook-form";
import { Prompt, useHistory, useParams } from "react-router-dom";
import _ from "lodash";

import { yupResolver } from "@hookform/resolvers/yup";

import {
  ADD_PRODUCT,
  UPDATE_PRODUCT,
} from "../../../graphql/mutations/product.mutations";
import {
  GET_PRODUCT,
  GET_PRODUCTS,
} from "../../../graphql/queries/product.queries";
import { GET_TAXES } from "../../../graphql/queries/tax.queries";

import { productSchema } from "../../../helpers/validations";
import { TAXES } from "../../../helpers/constants";

const defaultValues = {
  code: "",
  auxiliar_code: "",
  product_type: "Servicio",
  prices: [
    {
      value: 0,
    },
  ],
  description: "",
  aditional_details: "",
  measurement_unit: "",
  cost: 0,
  bulk_sale: false,
  iva: "",
  ice: "",
};

const NewProduct = (props) => {
  let { id } = useParams();
  let history = useHistory();

  const { register, handleSubmit, reset, control, formState, errors } = useForm(
    {
      defaultValues,
      resolver: yupResolver(productSchema),
    }
  );

  const priceFields = useFieldArray({
    control: control,
    name: "prices",
  });

  const { data } = useQuery(GET_PRODUCT, {
    variables: { id },
    skip: !id,
  });

  const { data: dataTaxes } = useQuery(GET_TAXES);

  const [createProduct, { loading }] = useMutation(ADD_PRODUCT, {
    refetchQueries: [
      { query: GET_PRODUCTS, variables: { offset: 1, limit: 9, queries: {} } },
    ],
  });

  const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: [
      { query: GET_PRODUCTS, variables: { offset: 1, limit: 9, queries: {} } },
    ],
  });

  const loadingProduct = useCallback(
    (data) => {
      if (data) {
        let defaultValues = {
          code: data.product.code,
          auxiliar_code: data.product.auxiliar_code,
          product_type: data.product.product_type,
          prices: data.product.prices,
          description: data.product.description,
          aditional_details: data.product.aditional_details,
          measurement_unit: data.product.measurement_unit,
          cost: data.product.cost,
          bulk_sale: data.product.bulk_sale,
          iva: data.product.taxes.find((item) => item.type === TAXES.IVA)?.id,
          ice: data.product.taxes.find((item) => item.type === TAXES.ICE)?.id,
        };

        reset(defaultValues);
      }
    },
    [reset]
  );

  useEffect(() => {
    loadingProduct(data);
  }, [data, loadingProduct]);

  const submitForm = (dataForm) => {
    const { iva, ice, ...rest } = dataForm;
    const taxes = [];

    if(dataForm.iva)
      taxes.push(dataForm.iva);
      
    if(dataForm.ice)
      taxes.push(dataForm.ice);
    
    let toSendData = { ...rest, taxes };

    if (id)
      updateProduct({
        variables: { productUpdated: toSendData, id },
      })
        .then((res) => {
          const { updateProduct } = res.data;
          if (updateProduct?.id) {
            toast.success(updateProduct?.message);
            history.push(`/panel/productos`);
          }
        })
        .catch((err) => {
          console.log(`[ERROR] ${err}`);
        });
    else
      createProduct({ variables: { product: toSendData } })
        .then((res) => {
          const { createProduct } = res.data;
          if (createProduct?.id) {
            toast.success(createProduct?.message);
            history.push(`/panel/productos`);
          } else {
            toast.error(createProduct?.message);
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
                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">
                    Código auxiliar
                  </label>
                  <div className="col">
                    <input
                      type="text"
                      name="auxiliar_code"
                      ref={register()}
                      className={`form-control ${
                        errors.auxiliar_code ? "is-invalid" : ""
                      }`}
                      aria-label="Código Auxiliar"
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">Tipo</label>
                  <div className="col">
                    <select
                      className={`form-select form-control ${
                        errors.product_type ? "is-invalid" : ""
                      }`}
                      name="product_type"
                      ref={register()}
                      aria-label="Tipo de producto"
                    >
                      <option>Servicio</option>
                      <option>Bien</option>
                      <option>Reembolso</option>
                      <option>Tasa</option>
                    </select>
                  </div>
                </div>
                {priceFields.fields.map((price, index) => {
                  return (
                    <div className="row align-items-center mb-4" key={index}>
                      <label className="col-3 col-form-label">Precio</label>
                      <div className="col-5">
                        <div className="input-group">
                          <span
                            className="input-group-text"
                            id="addon-dollar-1"
                          >
                            $
                          </span>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.prices ? "is-invalid" : ""
                            }`}
                            name={`prices[${index}].value`}
                            ref={register()}
                            aria-label="Precio"
                            aria-describedby="addon-dollar-1"
                            autoComplete="off"
                            defaultValue={price.value}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">
                    Venta al granel
                  </label>
                  <div className="col">
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        name="bulk_sale"
                        ref={register()}
                        className="custom-control-input"
                        id="bulk_sale_input"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="bulk_sale_input"
                      >
                        Habilitar
                      </label>
                    </div>
                  </div>
                </div>

                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">IVA</label>
                  <div className="col">
                    <select
                      className={`form-select form-control ${
                        errors.iva ? "is-invalid" : ""
                      }`}
                      name="iva"
                      ref={register()}
                      aria-label="IVA"
                    >
                      <option value="">---</option>
                      {dataTaxes?.taxes
                        .filter((item) => item.type === TAXES.IVA)
                        .map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">ICE</label>
                  <div className="col">
                    <select
                      className={`form-select form-control ${
                        errors.ice ? "is-invalid" : ""
                      }`}
                      name="ice"
                      ref={register()}
                      aria-label="ICE"
                    >
                      <option value="">---</option>
                      {dataTaxes?.taxes
                        .filter((item) => item.type === TAXES.ICE)
                        .map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">Costo</label>
                  <div className="col-5">
                    <div className="input-group">
                      <span className="input-group-text" id="addon-dollar-2">
                        $
                      </span>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.cost ? "is-invalid" : ""
                        }`}
                        name="cost"
                        ref={register()}
                        aria-label="Costo"
                        aria-describedby="addon-dollar-2"
                        autoComplete="off"
                      />
                    </div>
                    <div className="form-text">Valor sin impuestos</div>
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
                <div className="row mb-4">
                  <label className="col-3 col-form-label">
                    Detalles adicionales
                  </label>
                  <div className="col">
                    <textarea
                      className={`form-control ${
                        errors.aditional_details ? "is-invalid" : ""
                      }`}
                      rows="2"
                      name="aditional_details"
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
                        id ? history.push("/panel/productos") : reset()
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
            <h6 className="mb-4">Registro de productos o servicios</h6>
            <p>
              Los ítems registrados formarán parte de su catálogo de productos y
              servicios que podrá utilizar para facturar.
            </p>
            <p>
              Es necesario que llene todos los campos requeridos y de manera
              correcta.
            </p>
            <p>
              El código de producto o servicio deber ser único, si ingresa un
              valor que ya está registrado, los datos no se guardarán.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
