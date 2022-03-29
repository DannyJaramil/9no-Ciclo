// GENERAL IMPORTS
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { NavLink as Link } from "react-router-dom";

import { useParams } from "react-router-dom";
import roundTo from "round-to";

// FORM IMPORTS
import { useForm, Controller } from "react-hook-form";
import { invoiceSchema } from "../../../../helpers/validations";
import { yupResolver } from "@hookform/resolvers/yup";

// COMPONENT IMPORTS
import ClientSuggestions from "../../elements/ClientSuggestions"; // CLIENT SUGGESTIONS
import ProductSuggestions from "../../elements/ProductSuggestions"; // PRODUCT SUGGESTIONS

import ProductList from "../../elements/ProductList"; // PRODUCT LIST
import PaymentList from "../../elements/PaymentList";

import NumberFormat from "react-number-format";
import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";

// GRAPHQL IMPORTS
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { GET_ALL_EMISSION_POINTS } from "../../../../graphql/queries/emissionPoint.queries";

import { ADD_INVOICE, EDIT_INVOICE } from "../../../../graphql/mutations/invoice.mutations";

import { GET_INVOICE } from "../../../../graphql/queries/invoice.queries";
import { GET_PAYMENTS_BY_ID } from "../../../../graphql/queries/payment.queries";

// CONSTANTS
import { TAXES, suggestions } from "../../../../helpers/constants";

// OTHER IMPORTS
import warning_icon from "../../../../assets/img/warning.svg";
import thumbs_up_icon from "../../../../assets/img/thumbs-up.svg";

const NewBill = (props) => {
  // GENERAL VARS
  const { id } = useParams(); // ID INVOICE (When it's being edited)
  const today = new Date(); // TODAY'S DATE
  const inputRef = useRef(null);

  const [customer, setCustomer] = useState({ reference: '', email: '', address: '' }); // SELECTED CUSTOMER
  const [products, setProducts] = useState([]); // SELECTED PRODUCTS
  const [payments, setPayments] = useState([{ id: uuidv4(), method: '', amount: 0, notes: '' }]); // GENERATED PAYMENTS

  const [totalValues, setTotalValues] = useState({ subtotal: 0, discount: 0, taxes: 0, ice: 0, total: 0 });
  const [paymentValues, setPaymentValues] = useState({ pending: 0, total: 0 });
  const [retentions, setRetentions] = useState({ rental: 0, iva: 0 });
  const [totalRetentions, setTotalRetentions] = useState(0);

  const [activeCredit, setActiveCredit] = useState(false);
  const [activeRetention, setActiveRetention] = useState(false);

  const [defaultCustomer, setDefaultCustomer] = useState(null);
  const [reseting, setReseting] = useState(false);

  // MODALS
  const [modal, setModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [modalMsg, setModalMsg] = useState({ title: '', msg: '' });

  // GRAPHQL VARS
  const { data: dataEmissionPoints } = useQuery(GET_ALL_EMISSION_POINTS, {
    fetchPolicy: "cache-and-network"
  }); // Emission Points

  const [getInvoice, { data: dataInvoice }] = useLazyQuery(GET_INVOICE, { fetchPolicy: "cache-and-network" });
  const [getPayments, { data: dataPayments }] = useLazyQuery(GET_PAYMENTS_BY_ID, { fetchPolicy: "cache-and-network" });

  const [createInvoice, { loading: loadingSave }] = useMutation(ADD_INVOICE);
  const [updateInvoice, { loading: loadingUpdate }] = useMutation(EDIT_INVOICE);

  // OBSERVERS
  useEffect(() => {
    if(id){
      getInvoice({ variables: { id } });
      getPayments({ variables: { id } });
    }
  // eslint-disable-next-line
  }, []);

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
    let total_amount = 0;
    payments.forEach(payment => {
      const amount = parseFloat(payment.amount);
      total_amount += (amount ? amount : 0);
    });

    setPaymentValues({
      pending: totalValues.total - totalRetentions - total_amount,
      total: total_amount + totalRetentions
    });

    // eslint-disable-next-line
  }, [payments, totalRetentions, totalValues]);

  useEffect(() => {
    let rental = parseFloat(retentions.rental),
      iva = parseFloat(retentions.iva),
      amount = 0;

    amount += rental ? rental : 0;
    amount += iva ? iva : 0;

    setTotalRetentions(amount);

    // eslint-disable-next-line
  }, [retentions, totalValues.total]);

  useEffect(() => {
    if (defaultCustomer === {})
      setDefaultCustomer(null);
  }, [defaultCustomer]);

  useEffect(() => {
    setEditValues();
  // eslint-disable-next-line
  }, [dataInvoice, dataPayments]);

  // FORM VARS
  const { register, handleSubmit, setValue, reset, control } = useForm({
    defaultValues: {
      emission_date: `${today.getFullYear()}-${today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)}-${today.getDate() < 10 ? '0' + today.getDate() : today.getDate()}`,
      credit: {
        time_limit: `${today.getFullYear()}-${today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)}-${today.getDate() < 10 ? '0' + today.getDate() : today.getDate()}`,
        amount: 0
      },
      retentions: {
        rental: 0,
        iva: 0
      },
      adicional_information: '',
    },
    resolver: yupResolver(invoiceSchema),
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
    if (activeCredit && !dataForm.customer?.reference) {
      setModalMsg({
        title: 'Datos incompletos',
        msg: 'Debe elegir un cliente para emitir una factura a crédito.'
      });
      toggle();

      return;
    }

    let payment_list = payments.filter(x => x.method && (!isNaN(parseFloat(x.amount)) && x.amount > 0)).map(x => ({ payment_date: dataForm.emission_date, amount: parseFloat(x.amount), method: x.method, notes: x.notes }));
    let total = parseFloat(dataForm.credit.amount) + parseFloat(totalRetentions);

    if (activeCredit && payment_list.length === 0 && total !== parseFloat(totalValues.total)) {
      setModalMsg({
        title: 'Datos incorrectos',
        msg: 'El monto a crédito ($' + parseFloat(total).toFixed(2) + ') debe ser igual al total de la factura ($' + parseFloat(totalValues.total).toFixed(2) + ').'
      });
      toggle();

      return;
    } else if (activeCredit && (parseFloat(dataForm.credit.amount) + parseFloat(paymentValues.total)) !== parseFloat(totalValues.total)) {
      setModalMsg({
        title: 'Datos incorrectos',
        msg: 'El total pagado más el monto a crédito ($' + (parseFloat(dataForm.credit.amount) + parseFloat(paymentValues.total)).toFixed(2) + ') debe ser igual al total de la factura ($' + parseFloat(totalValues.total).toFixed(2) + ').'
      });
      toggle();

      return;
    }

    if (activeCredit && (isNaN(dataForm.credit.amount) || (!isNaN(dataForm.credit.amount) && dataForm.credit.amount <= 0))) {
      setModalMsg({
        title: 'Datos incompletos',
        msg: 'Por favor, complete los datos de crédito.'
      });
      toggle();

      return;
    }

    if (!activeCredit && payment_list.length === 0) {
      setModalMsg({
        title: 'Datos incompletos',
        msg: 'Es necesario añadir al menos un pago para generar la factura.'
      });
      toggle();

      return;
    }

    if (!activeCredit && paymentValues.total !== totalValues.total) {
      setModalMsg({
        title: 'Datos incorrectos',
        msg: 'El total pagado ($' + parseFloat(paymentValues.total).toFixed(2) + ') debe ser igual al total de la factura ($' + parseFloat(totalValues.total).toFixed(2) + ').'
      });
      toggle();

      return;
    }

    if (!activeCredit) {
      dataForm.credit = {
        time_limit: null,
        amount: null
      };
    }

    if(!dataForm.customer.reference){
      dataForm.customer = {
        reference: null,
        address: "",
        email: ""
      };
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

    dataForm.items = product_list;
    dataForm.subtotal = totalValues.subtotal;
    dataForm.iva_value = totalValues.taxes;
    dataForm.ice_value = totalValues.ice;
    dataForm.total = totalValues.total;

    dataForm.pending_balance = paymentValues.pending;
    dataForm.total_paid = paymentValues.total;

    dataForm.payments = payment_list;

    inputRef.current.focus();
    
    if(id){
      updateInvoice({ variables: { invoice: dataForm, id: id } })
      .then(res => {
        toggleSuccess();
      })
      .catch(err => {
        console.log(`[ERROR]`, err);
      });
    }else{      
      createInvoice({ variables: { invoice: dataForm } })
      .then(res => {
        toggleSuccess();
      })
      .catch(err => {
        console.log(`[ERROR]`, err);
      });
    }
  }

  // TOGGLE FUNCTIONS
  const toggleCreditInput = () => {
    if (products.length > 0) {
      if (activeCredit) {
        setValue('credit.time_limit', `${today.getFullYear()}-${today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)}-${today.getDate() < 10 ? '0' + today.getDate() : today.getDate()}`);
        setValue('credit.amount', 0);
      }

      setActiveCredit(!activeCredit);
    }
  };

  const toggleRetentionInput = () => {
    if (products.length > 0) {
      if (activeRetention) {
        setValue('retentions.rental', 0);
        setValue('retentions.iva', 0);

        setRetentions({
          rental: 0,
          iva: 0
        });
      }

      setActiveRetention(!activeRetention);
    }
  };

  const toggle = () => setModal(!modal);
  const toggleSuccess = () => setSuccessModal(!successModal);

  // ON CHANGE FUNCTIONS
  const changeCreditAmount = value => {
    var amount_value = parseFloat(value);
    if (amount_value) {
      if (amount_value > paymentValues.pending) {
        setValue('credit.amount', paymentValues.pending);
      }
    }
  };

  const changeRetention = (value, name) => {
    var amount_value = parseFloat(value),
      pending_value = parseFloat(paymentValues.pending),
      retention_value = parseFloat(retentions[name]);

    if (amount_value) {
      if (amount_value <= (pending_value + retention_value)) {
        let new_retentions = { ...retentions };
        new_retentions[name] = amount_value;

        setRetentions(new_retentions);
      } else {
        setValue('retentions.rental', retention_value);

        setModalMsg({
          title: 'Datos incorrectos',
          msg: 'El valor que intenta ingresar sobrepasa el saldo pendiente.'
        });
        toggle();
      }
    } else {
      let new_retentions = { ...retentions };
      new_retentions[name] = 0;

      setRetentions(new_retentions);
    }
  };

  const resetForm = () => {
    setReseting(true);

    reset({
      emission_date: `${today.getFullYear()}-${today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)}-${today.getDate() < 10 ? '0' + today.getDate() : today.getDate()}`,
      aditional_information: '',
      referral_guide: '',
      credit: {
        time_limit: `${today.getFullYear()}-${today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)}-${today.getDate() < 10 ? '0' + today.getDate() : today.getDate()}`,
        amount: 0
      },
      retentions: {
        rental: 0,
        iva: 0
      },
    });

    setCustomer({ reference: '', email: '', address: '' });
    setDefaultCustomer({});

    setProducts([]);

    setPayments([{ id: uuidv4(), method: '', amount: 0, notes: '' }]);
    setRetentions({ rental: 0, iva: 0 });
    
    setActiveCredit(false);
    setActiveRetention(false);

    setTimeout(() => {
      if (successModal)
        toggleSuccess();

      setReseting(false);
    }, 500);
  };

  const setEditValues = () => {
    if(dataInvoice && dataPayments){
      var { invoice } = dataInvoice;

      var emission_date = new Date(parseInt(invoice.emission_date));
      var time_limit = invoice.credit.time_limit ? new Date(parseInt(invoice.credit.time_limit)) : new Date();

      reset({
        emission_date: `${emission_date.getFullYear()}-${emission_date.getMonth() < 10 ? '0'+(emission_date.getMonth()+1):(emission_date.getMonth()+1)}-${emission_date.getDate() < 10 ? '0'+emission_date.getDate():emission_date.getDate()}`,
        emission_point: invoice.emission_point,
        referral_guide: invoice.referral_guide,
        aditional_information: invoice.aditional_information,
        credit: {
          time_limit: `${time_limit.getFullYear()}-${time_limit.getMonth() < 10 ? '0'+(time_limit.getMonth()+1):(time_limit.getMonth()+1)}-${time_limit.getDate() < 10 ? '0'+time_limit.getDate():time_limit.getDate()}`,
          amount: invoice.credit.amount ? parseFloat(invoice.credit.amount) : 0,
        },
        retentions: {
          rental: invoice.retentions.rental,
          iva: invoice.retentions.iva
        },
      });

      setDefaultCustomer(invoice.customer.reference);
      setCustomer({ reference: invoice.customer.reference?.id, email: invoice.customer.email, address: invoice.customer.address });
      
      var items = invoice.items.map(item => {
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
      
      setRetentions({ rental: invoice.retentions.rental, iva: invoice.retentions.iva });

      if(invoice.retentions.rental > 0 || invoice.retentions.iva > 0)
        setActiveRetention(true);

      if(invoice.credit.time_limit && invoice.credit.amount)
        setActiveCredit(true);

      var { paymentsById } = dataPayments; 

      var payments_array = paymentsById.map(payment => {
        return {
          id: uuidv4(),
          method: payment.method.id,
          amount: payment.amount,
          notes: payment.notes
        };
      });
      
      payments_array.push({ id: uuidv4(), method: '', amount: 0, notes: '' });
      setPayments(payments_array);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(submitForm)}>
        <fieldset disabled={loadingSave || loadingUpdate}>
          <div className="container-fluid">

            <div className="row mb-4">
              <div className="col">
              <Link to={`/panel/facturacion/facturas`} className="btn btn-secondary mr-2" activeClassName={null}>
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
                    <h6 className="title_card">Datos del cliente</h6>
                    <div className="row mb-4">
                      <label className="col-3 col-form-label mt-2">Nombre</label>
                      <div className="col">
                        <input type="hidden" name="customer.reference" ref={register()} defaultValue={customer.reference} />
                        <ClientSuggestions
                          setCustomer={setCustomer}
                          defaultValue={defaultCustomer}
                          inputRef={inputRef}
                        />
                        <div className="form-text">Si no se especifica un cliente, la factura se registrará a nombre de Consumidor Final.</div>
                      </div>
                    </div>
                    <div className="row align-items-center mb-4">
                      <label className="col-3 col-form-label">Email</label>
                      <div className="col">
                        <input type="email" name="customer.email" ref={register()} className={`form-control`} aria-label="Email" autoComplete="off" defaultValue={customer.email} />
                      </div>
                    </div>
                    <div className="row align-items-center mb-4">
                      <label className="col-3 col-form-label">Dirección</label>
                      <div className="col">
                        <input type="text" name="customer.address" ref={register()} className={`form-control`} aria-label="Dirección" autoComplete="off" defaultValue={customer.address} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card mb-4">
                  <div className="card-body">
                    <h6 className="title_card">Información de factura</h6>
                    <div className="row align-items-center mb-4">
                      <label className="col-3 col-form-label">Fecha de Emisión</label>
                      <div className="col">
                        <input type="date" name="emission_date" ref={register()} className={`form-control`} aria-label="Fecha de Emisión" autoComplete="off" />
                      </div>
                    </div>
                    <div className="row align-items-center mb-4">
                      <label className="col-3 col-form-label">Punto de Emisión</label>
                      <div className="col">
                        <select name="emission_point" id="emission_point_input" ref={register()} className={`form-control`}>
                          {dataEmissionPoints?.allEmissionPoints?.map((point, index) => (
                            <option
                              key={point.id}
                              value={`${point.establishment.code}-${point.code}`}
                            >
                              {`${point.establishment.code}-${point.code}`} { point.description ? `(${point.description})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="row align-items-center mb-4">
                      <label className="col-3 col-form-label">Guía de remisión</label>
                      <div className="col">
                        <Controller
                          render={({ onChange, value }) => (
                            <NumberFormat
                              format="###-###-#########"
                              mask="_"
                              className={`form-control`}
                              autoComplete="off"
                              allowEmptyFormatting
                              onValueChange={(v) => onChange(v.value)}
                              value={value}
                            />
                          )}
                          name="referral_guide"
                          control={control}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            { /* END GENERAL INVOICE DATA */}

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
                  type={suggestions.ISSUED}
                />
              </div>
            </div>
            { /* END PRODUCT SUGGESTIONS */}

            { /* ADITIONAL INFORMARION AND TOTAL VALUES */}
            <div className="row mb-4">
              <div className="col">
                <div className="card">
                  <div className="card-body">
                    <h6 className="title_card">Información adicional</h6>
                    <div className="row">
                      <label className="col-auto col-form-label">Descripción</label>
                      <div className="col">
                        <textarea className={`form-control`} rows="4" name="aditional_information" ref={register()} ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-5">
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
            { /* END ADITIONAL INFORMARION AND TOTAL VALUES */}

            <div className="row mb-4">
              <div className="col">
                <div className="divider"></div>
              </div>
            </div>

            { /* PAYMENT VALUES */}
            <div className="row mb-4">
              <div className="col">
                <div className="outline_card">
                  <div className="card-body text-center">
                    <div className="big_value">
                      <span className="the_value">${parseFloat(paymentValues.pending).toFixed(2)}</span>
                      <span className="the_tag">Saldo Pendiente</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="outline_card">
                  <div className="card-body text-center">
                    <div className="big_value">
                      <span className="the_value">${parseFloat(paymentValues.total).toFixed(2)}</span>
                      <span className="the_tag">Total Pagado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            { /* END PAYMENT VALUES */}

            { /* CREDIT AND RETENTIONS */}
            <div className="row mb-4">
              <div className="col">
                <div className="card">
                  <div className="card-body">
                    <div className="custom-control custom-switch mb-4">
                      <input type="checkbox" className="custom-control-input" id="active_retention" checked={activeCredit} onChange={e => toggleCreditInput()} />
                      <label className="custom-control-label" htmlFor="active_retention">Factura a crédito</label>
                    </div>
                    <div className="row">
                      <div className="col">
                        <label>Plazo:</label>
                        <input type="date" name="credit.time_limit" ref={register()} className={`form-control`} disabled={!activeCredit} min={`${today.getFullYear()}-${today.getMonth() < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)}-${today.getDate() < 10 ? '0' + today.getDate() : today.getDate()}`} autoComplete="off" />
                      </div>
                      <div className="col">
                        <label> Monto:</label>
                        <input type="number" min="0" step="0.01" name="credit.amount" ref={register()} onChange={e => changeCreditAmount(e.target.value)} className={`form-control text-center`} disabled={!activeCredit} autoComplete="off" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card">
                  <div className="card-body">
                    <div className="custom-control custom-switch mb-4">
                      <input type="checkbox" className="custom-control-input" id="active_credit" checked={activeRetention} onChange={e => toggleRetentionInput()} />
                      <label className="custom-control-label" htmlFor="active_credit">Retenciones</label>
                    </div>
                    <div className="row">
                      <div className="col">
                        <label>Valor retenido por Renta:</label>
                        <input
                          type="number"
                          name="retentions.rental"
                          step="0.01"
                          min="0"
                          disabled={!activeRetention}
                          onChange={e => changeRetention(e.target.value, 'rental')}
                          ref={register()}
                          className={`form-control text-center`}
                          autoComplete="off"
                        />
                      </div>
                      <div className="col">
                        <label>Valor retenido por IVA:</label>
                        <input
                          type="number"
                          name="retentions.iva"
                          step="0.01"
                          min="0"
                          disabled={!activeRetention}
                          onChange={e => changeRetention(e.target.value, 'iva')}
                          ref={register()}
                          className={`form-control text-center`}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            { /* END CREDIT AND RETENTIONS */}

            { /* PAYMENTS */}
            <PaymentList
              payments={payments}
              setPayments={setPayments}
              limit={paymentValues.pending}
            />
            { /* END PAYMENTS */}

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
            to={`/panel/facturacion/facturas`}
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

export default NewBill;