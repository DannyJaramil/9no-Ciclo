// GENERAL IMPORTS
import React, { useEffect, useState, useRef } from "react";
import { NavLink as Link, useParams } from "react-router-dom";
import roundTo from "round-to";

// FORM IMPORTS
import { useForm, Controller } from "react-hook-form";
import { issuedInvoiceSchema } from "../../../../helpers/validations";
import { yupResolver } from "@hookform/resolvers/yup";

// COMPONENT IMPORTS
import UserSuggestions from "../../elements/ClientSuggestions";
import ProductSuggestions from "../../elements/ProductSuggestions"; // PRODUCT SUGGESTIONS

import ProductList from "../../elements/ProductList"; // PRODUCT LIST
import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";

import NumberFormat from "react-number-format";

// GRAPHQL IMPORTS
import { useMutation, useLazyQuery } from "@apollo/client";

import { ADD_PURCHASE_INVOICE, EDIT_PURCHASE_INVOICE } from "../../../../graphql/mutations/purchaseInvoice.mutations";
import { GET_PURCHASE_INVOICE } from "../../../../graphql/queries/purchaseInvoice.queries";

// CONSTANTS
import { TAXES, suggestions } from "../../../../helpers/constants";

// OTHER IMPORTS
import warning_icon from "../../../../assets/img/warning.svg";
import thumbs_up_icon from "../../../../assets/img/thumbs-up.svg";

const NewIssuedInvoice = (props) => {
  // GENERAL VARS
  const { id } = useParams(); // ID INVOICE (When it's being edited)
  const today = new Date(); // TODAY'S DATE
  const inputRef = useRef(null);

  const [customer, setCustomer] = useState({ reference: '' }); // SELECTED CUSTOMER
  const [products, setProducts] = useState([]); // SELECTED PRODUCTS

  const [totalValues, setTotalValues] = useState({ subtotal: 0, discount: 0, taxes: 0, ice: 0, total: 0 });
  const [reseting, setReseting] = useState(false);

  const [defaultCustomer, setDefaultCustomer] = useState(null);

  // MODALS
  const [modal, setModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [modalMsg, setModalMsg] = useState({ title: '', msg: '' });

  // GRAPHQL VARS
  const [createPurchaseInvoice, { loading: loadingSave }] = useMutation(ADD_PURCHASE_INVOICE);
  const [updatePurchaseInvoice, { loading: loadingUpdate }] = useMutation(EDIT_PURCHASE_INVOICE);
  const [getInvoice, { data: dataInvoice }] = useLazyQuery(GET_PURCHASE_INVOICE, { fetchPolicy: "cache-and-network" });

  // OBSERVERS
  useEffect(() => {
    if(id){
      getInvoice({variables: { id }});
    }
  // eslint-disable-next-line
  }, [])
  useEffect(() => {
    let subtotal = 0, taxes = 0, ice = 0, total = 0, discount = 0;

    products.forEach(product => {
      const quantity = parseFloat(product.quantity);
      const price = parseFloat(product.price);
      const discount_value = parseFloat(product.discount);
      const amount = quantity && price ? quantity * price : 0;

      const iva = product.taxes.find(item => item.type === TAXES.IVA);
      taxes += iva ? (iva.percentage * amount) : 0;

      const ice_value = product.taxes.find(item => item.type === TAXES.ICE);
      ice += ice_value ? (ice_value.percentage * amount) : 0;

      discount += discount_value ? (discount_value / 100) * amount : 0;

      subtotal += amount;
    });

    subtotal = roundTo(subtotal, 2);
    discount = roundTo(discount, 2);
    taxes = roundTo(taxes, 2);
    ice = roundTo(ice, 2);

    total = subtotal + taxes + ice - discount;
    total = roundTo(total, 2);

    setTotalValues({
      subtotal,
      discount,
      taxes,
      ice,
      total
    });

    // eslint-disable-next-line
  }, [products]);

  useEffect(() => {
    if (defaultCustomer === {})
      setDefaultCustomer(null);
  }, [defaultCustomer]);

  useEffect(() => {
    setEditValues();
  // eslint-disable-next-line
  }, [dataInvoice]);

  // FORM VARS
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      provider: "",
      emission_date: `${today.getFullYear()}-${today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)}-${today.getDate() < 10 ? '0' + today.getDate() : today.getDate()}`,
      max_payment_date: `${today.getFullYear()}-${today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)}-${today.getDate() < 10 ? '0' + today.getDate() : today.getDate()}`,
      invoice_number: "",
      referral_guide: ""
    },
    resolver: yupResolver(issuedInvoiceSchema),
  });

  // HANDLE SUBMIT
  const submitForm = dataForm => {
    // Check for added products
    if (products.length === 0) {
      setModalMsg({
        title: 'Datos incompletos',
        msg: 'Es necesario añadir al menos un producto para generar la factura.'
      });
      toggle();

      return;
    }

    // Check for customer when the credit is active
    if (!dataForm.provider) {
      setModalMsg({
        title: 'Datos incompletos',
        msg: 'Debe elegir un proveedor para emitir una factura de compra.'
      });
      toggle();

      return;
    }

    if(dataForm.invoice_number.length < 15){
      setModalMsg({
        title: 'Datos incorrectos',
        msg: 'Por favor, escriba el número completo de la factura. Por ejemplo 001-001-123456789'
      });
      toggle();

      return;
    }

    let product_list = products.map(x =>
      ({
        product: x.id,
        quantity: parseInt(x.quantity),
        price: parseFloat(x.price),
        discount: parseFloat(x.discount),
        subtotal: (parseFloat(x.quantity) * parseFloat(x.price))
      })
    );

    dataForm.invoice_number = `${dataForm.invoice_number.substring(0,3)}-${dataForm.invoice_number.substring(3,6)}-${dataForm.invoice_number.substring(6,15)}`;
    dataForm.items = product_list;
    dataForm.subtotal = totalValues.subtotal;
    dataForm.iva_value = totalValues.taxes;
    dataForm.ice_value = totalValues.ice;
    dataForm.total = totalValues.total;

    dataForm.pending_balance = totalValues.total;
    dataForm.total_paid = 0;

    if(id){
      updatePurchaseInvoice({ variables: { invoice: dataForm, id: id } })
      .then(res => {
        toggleSuccess();
      })
      .catch(err => {
        console.log(`[ERROR]`, err);
      });
    }else{
      createPurchaseInvoice({ variables: { invoice: dataForm } })
      .then(res => {
        toggleSuccess();
      })
      .catch(err => {
        console.log(`[ERROR]`, err);
      });
    }
  };

  const resetForm = () => {
    setReseting(true);
    reset({
      provider: "",
      emission_date: `${today.getFullYear()}-${today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)}-${today.getDate() < 10 ? '0' + today.getDate() : today.getDate()}`,
      max_payment_date: `${today.getFullYear()}-${today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)}-${today.getDate() < 10 ? '0' + today.getDate() : today.getDate()}`,
      invoice_number: "",
      referral_guide: "",
    });

    setCustomer({ reference: '' });
    setDefaultCustomer({});

    setProducts([]);

    setTimeout(() => {
      if (successModal)
        toggleSuccess();
      
      inputRef.current.focus();
      setReseting(false);
    }, 500);
  };

  const setEditValues = () => {
    if(dataInvoice){
      var { purchaseInvoice } = dataInvoice;

      var emission_date = new Date(parseInt(purchaseInvoice.emission_date));
      var max_payment_date = new Date(parseInt(purchaseInvoice.max_payment_date));

      reset({
        emission_date: `${emission_date.getFullYear()}-${emission_date.getMonth() < 10 ? '0' + (emission_date.getMonth() + 1) : (emission_date.getMonth() + 1)}-${emission_date.getDate() < 10 ? '0' + emission_date.getDate() : emission_date.getDate()}`,
        max_payment_date: `${max_payment_date.getFullYear()}-${max_payment_date.getMonth() < 10 ? '0' + (max_payment_date.getMonth() + 1) : (max_payment_date.getMonth() + 1)}-${max_payment_date.getDate() < 10 ? '0' + max_payment_date.getDate() : max_payment_date.getDate()}`,
        invoice_number: purchaseInvoice.invoice_number?.replace(/-/g,''),
        referral_guide: purchaseInvoice.referral_guide,
      });

      setDefaultCustomer(purchaseInvoice.provider);
      setCustomer({ reference: purchaseInvoice.provider?.id });

      var items = purchaseInvoice.items.map(item => {
        return {
          id: item.product.id,
          code: item.product.code,
          description: item.product.description,
          quantity: item.quantity,
          discount: item.discount,
          price: item.price,
          taxes: item.product.taxes,
        };
      });
      setProducts(items);
    }
  };

  // TOGGLE FUNCTIONS
  const toggle = () => setModal(!modal);
  const toggleSuccess = () => setSuccessModal(!successModal);

  return (
    <>
      <form onSubmit={handleSubmit(submitForm)}>
        <fieldset disabled={loadingSave || loadingUpdate}>
          <div className="container-fluid">

            <div className="row mb-4">
              <div className="col">
                <Link
                  to={`/panel/compras/facturas`}
                  className="btn btn-secondary mr-2"
                  activeClassName={null}
                >
                  <i className="bi bi-arrow-bar-left mr-2" style={{ position: 'relative', top: '1px' }}></i>
                Regresar al listado
              </Link>
              </div>
            </div>

            { /* GENERAL INVOICE DATA */}
            <div className="row">
              <div className="col-6">
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="row mb-4">
                      <label className="col-3 col-form-label mt-2">Proveedor</label>
                      <div className="col">
                        <input
                          type="hidden"
                          name="provider"
                          ref={register()}
                          value={customer.reference}
                        />
                        <UserSuggestions
                          setCustomer={setCustomer}
                          defaultValue={defaultCustomer}
                          inputRef={inputRef}
                        />
                      </div>
                    </div>
                    <div className="row align-items-center mb-4">
                      <label className="col-3 col-form-label">Fecha de Emisión</label>
                      <div className="col">
                        <input
                          type="date"
                          name="emission_date"
                          ref={register()}
                          className={`form-control`}
                          aria-label="Fecha de Emisión"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="row align-items-center">
                      <label className="col-3 col-form-label">Fecha máx. de Pago</label>
                      <div className="col">
                        <input
                          type="date"
                          name="max_payment_date"
                          ref={register()}
                          className={`form-control`}
                          aria-label="Fecha de máxima de Pago"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="row align-items-center mb-4">
                      <label className="col-3 col-form-label">Número de Factura</label>
                      <div className="col">
                        <Controller
                          render={({ onChange, value }) => (
                            <NumberFormat
                              format="###-###-#########"
                              mask="_"
                              className={`form-control`}
                              autoComplete="off"
                              allowEmptyFormatting
                              allowNegative={false}
                              onValueChange={(v) => onChange(v.value)}
                              value={value}
                            />
                          )}
                          name="invoice_number"
                          control={control}
                        />
                      </div>
                    </div>
                    <div className="row align-items-center mb-4">
                      <label className="col-3 col-form-label">Número de Autorización</label>
                      <div className="col">
                        <input
                          type="text"
                          name="auth_number"
                          ref={register()}
                          className={`form-control`}
                          aria-label="Número de autorización"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="row align-items-center">
                      <label className="col-3 col-form-label">Guía de remisión</label>
                      <div className="col">
                        <input
                          type="text"
                          name="referral_guide"
                          ref={register()}
                          className={`form-control`}
                          aria-label="Guía de remisión"
                          autoComplete="off"
                          placeholder="Ej: 055-078-654789321"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            { /* GENERAL INVOICE DATA */}

            { /* PRODUCTS LIST */}
            <ProductList
              products={products}
              setProducts={setProducts}
            />
            { /* END PRODUCTS LIST */}

            { /* PRODUCT SUGGESTIONS */}
            <div className="row mt-4 mb-5">
              <div className="col">
                <ProductSuggestions
                  products={products}
                  setProducts={setProducts}
                  type={suggestions.RECEIVED}
                />
              </div>
            </div>
            { /* END PRODUCT SUGGESTIONS */}

            { /* TOTAL VALUES */}
            <div className="row mb-4">
              <div className="col"></div>
              <div className="col-6">
                <div className="invoice_details">
                  <div className="row mb-3">
                    <div className="col-7">
                      <span className="detail">Subtotal:</span>
                    </div>
                    <div className="col-5 text-right">
                      <span className="value">${parseFloat(totalValues.subtotal).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-7">
                      <span className="detail">Descuento:</span>
                    </div>
                    <div className="col-5 text-right">
                      <span className="value">${parseFloat(totalValues.discount).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-7">
                      <span className="detail">Valor IVA:</span>
                    </div>
                    <div className="col-5 text-right">
                      <span className="value">${parseFloat(totalValues.taxes).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-7">
                      <span className="detail">Valor ICE:</span>
                    </div>
                    <div className="col-5 text-right">
                      <span className="value">${parseFloat(totalValues.ice).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="divider"></div>
                  <div className="row big">
                    <div className="col-7">
                      <span className="detail">Valor total:</span>
                    </div>
                    <div className="col-5 text-right">
                      <span className="value">${parseFloat(totalValues.total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            { /* END TOTAL VALUES */}

            <div className="row mb-4">
              <div className="col">
                <div className="divider"></div>
              </div>
            </div>

            <div className="row">
              <div className="col text-center">
                <button type="submit" className="btn btn-green btn-lg mr-3">Guardar</button>
              </div>
            </div>
          </div>
        </fieldset>
      </form>

      { /* ERROR MODAL */}
      <Modal isOpen={modal} toggle={toggle} className='modal-dialog-centered danger'>
        <ModalBody className="text-center">
          <img src={warning_icon} alt="Warning Icon" className="svg_icon mb-4" />
          <h5>{modalMsg.title}</h5>
          <p>{modalMsg.msg}</p>
        </ModalBody>
        <ModalFooter className="text-center">
          <Button color="danger" onClick={toggle}>Cerrar</Button>
        </ModalFooter>
      </Modal>
      { /* END ERROR MODAL */}

      { /* SUCCESS MODAL */}
      <Modal isOpen={successModal} toggle={toggleSuccess} backdrop={"static"} className='modal-dialog-centered'>
        <ModalBody className="text-center">
          <img src={thumbs_up_icon} alt="Success Icon" className="svg_icon mb-4" />
          <h5>¡Acción exitosa!</h5>
          <p>La factura ha sido { id ? 'editada':'generada' } correctamente.</p>
        </ModalBody>
        <ModalFooter className="text-center">
          { !id ? 
            (
              <Button 
                color="green" 
                onClick={() => resetForm()} 
                disabled={reseting}
              >
                Nueva factura
              </Button>
            ): null }
          <Link
            to={`/panel/compras/facturas`}
            className="btn btn-light-green"
            activeClassName={null}
          >
            Listado de comprobantes
          </Link>
        </ModalFooter>
      </Modal>
      { /* END SUCCESS MODAL */}
    </>
  );
};

export default NewIssuedInvoice;