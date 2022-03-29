import React, { useState, useEffect } from "react";

import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { toast } from "react-toastify";

import { NavLink as Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import { useQuery, useMutation } from "@apollo/client";

import { GET_INVOICE } from "../../../../graphql/queries/invoice.queries";
import { GET_PAYMENTS_BY_ID } from "../../../../graphql/queries/payment.queries";
import { GET_PAYMENT_TYPES } from "../../../../graphql/queries/paymentType.queries";

import { CREATE_PAYMENT } from "../../../../graphql/mutations/payment.mutations";


import {
  format_date,
  format_date_w_time,
  compare_dates_lt_today,
} from "../../../../helpers/utilities";

import { useForm } from "react-hook-form";
import { paymentSchema } from "../../../../helpers/validations";
import { yupResolver } from "@hookform/resolvers/yup";

import warning_icon from "../../../../assets/img/warning.svg";

import * as jsPDF from "jspdf";
import * as $ from "jquery";
import html2canvas from 'html2canvas'



const BillView = (props) => {
  let { id } = useParams();

  const { register, handleSubmit, formState, errors, reset } = useForm({
    defaultValues: {
      amount: "",
      method: "",
      notes: "",
      payment_date: "",
    },
    resolver: yupResolver(paymentSchema),
  });

  //Funcion para imprimir

  const generarPDF = () => {
   
    html2canvas(document.getElementById("content") ).then( function(canvas){
      //document.body.appendChild(canvas)
      const doc = new jsPDF("b", "mm", "a4");

      var width = doc.internal.pageSize.getWidth();
      var height = doc.internal.pageSize.getHeight();

      var imgdata= canvas.toDataURL("image/png",1.0);
      doc.addImage(imgdata,'PNG', 0, 0, width, height);
     //doc.addImage(imgdata,'PNG', 30, 30, width, height);
     
       doc.save('LoxaFac.pdf');

  });

  };


  const printPDF = () => {
   
    
    html2canvas(document.getElementById("content") ).then( function(canvas){
    
      //horizontal
      //const doc = new jsPDF("l", "mm", "a4");
      const doc = new jsPDF("b", "mm", "a4");
     //Para ajustar la imagen al doc
      var width = doc.internal.pageSize.getWidth();
      var height = doc.internal.pageSize.getHeight();

      var imgdata= canvas.toDataURL("image/png",1.0);
      doc.addImage(imgdata,'PNG', 0, 0, width, height);
      
  
      //doc.save('LoxaFac.pdf');
      doc.autoPrint();
    
      
      window.open(doc.output('bloburl'));
     
    
  });

  
  

  };


  const [invoice, setInvoice] = useState(null);
  const [payments, setPayments] = useState([]);

  const [modal, setModal] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalMsg, setModalMsg] = useState({ title: "", msg: "" });

  const { data } = useQuery(GET_INVOICE, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  }); // Invoice data

  const { data: dataPayments } = useQuery(GET_PAYMENTS_BY_ID, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  }); // Payments
  console.log("LONGITUD --->      "+payments.length)

  const { data: dataTypes } = useQuery(GET_PAYMENT_TYPES); // Payment types

  const [createPayment, { loading: loadingSave }] = useMutation(
    CREATE_PAYMENT,
    {
      refetchQueries: [
        { query: GET_INVOICE, variables: { id } },
        { query: GET_PAYMENTS_BY_ID, variables: { id } },
      ],
      fetchPolicy: "no-cache",
    }
  );

  useEffect(() => {
    if (data && data.invoice) {
      setInvoice(data.invoice);
    }
  }, [data]);

  useEffect(() => {
    if (dataPayments && dataPayments.paymentsById)
      setPayments(dataPayments.paymentsById);
  }, [dataPayments]);

  const toggle = () => {
    if (modal) {
      reset({
        amount: "",
        method: "",
        notes: "",
        payment_date: "",
      });
    }
    setModal(!modal);
  };

  const toggleModalError = () => setModalError(!modalError);
  
  console.log("EL ID ES"+id)

  const submitForm = (dataForm) => {

    
    if (invoice?.id) {
      if (dataForm.amount <= invoice.pending_balance) {
        dataForm.invoice = invoice?.id;
        createPayment({ variables: { payment: dataForm } })
          .then((res) => {
            const { createPayment } = res.data;
            if (createPayment?.id) {
              toast.success(createPayment?.message);
              toggle();
            } else {
              toast.error(createPayment?.message);
            }
          })
          .catch((err) => {
            console.log(`[ERROR]`, err);
          });
      } else {
        setModalMsg({
          title: "Datos incorrectos",
          msg: `El valor ingresado sobrepasa el saldo pendiente ($${parseFloat(
            invoice.pending_balance
          ).toFixed(2)}).`,
        });
        toggleModalError();
      }
    }
  };

  return (

    
    <div className="container-fluid">
     
   
  

      <div className="row mb-4">
        <div className="col">
          <Link
            to={`/panel/facturacion/facturas`}
            className="btn btn-secondary mr-2"
            activeClassName={null}
          >
            <i
              className="bi bi-arrow-bar-left mr-2"
              style={{ position: "relative", top: "1px" }}
            ></i>
            Regresar al listado
          </Link>
          {invoice && invoice.pending_balance > 0 ? (
            <button className="btn btn-green mr-2" onClick={toggle}>
              <i
                className="bi bi-cash-stack mr-2"
                style={{ position: "relative", top: "1px" }}
              ></i>
              Añadir pago
            </button>
          ) : null}
          <button className="btn btn-green mr-2"     onClick={() => printPDF()} >
            <i
              className="bi bi-printer-fill mr-2"
              style={{ position: "relative", top: "1px" }}
            ></i>
            Imprimir
          </button>

          <button className="btn btn-green mr-2"  onClick={() => generarPDF()}>
            <i
              className="bi bi-arrow-down-circle-fill  mr-2"
              style={{ position: "relative", top: "1px" }}
              
            ></i>
               PDF
          </button>

          <Link
            to={`/panel/facturacion/facturas/editar/${id}`}
            className="btn btn-green"
            activeClassName={null}
          >
            <i
              className="bi bi-pencil-fill mr-2"
              style={{ position: "relative", top: "1px" }}
            ></i>
            Editar
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Modal
            isOpen={modal}
            toggle={toggle}
            className="modal-dialog-centered"
           >
            <ModalHeader toggle={toggle}>Registrar pago</ModalHeader>
            <ModalBody>
              {!formState.isValid &&
              formState.isSubmitted &&
              !formState.isSubmitSuccessful ? (
                <div className="alert alert-danger" role="alert">
                  Es necesario llenar o corregir todos los datos{" "}
                  <strong>requeridos</strong>
                </div>
              ) : null}
              <form
                onSubmit={handleSubmit(submitForm)}
                id="frm_payment_register"
              >
                <input
                  type="hidden"
                  name="invoice"
                  value={invoice ? invoice.id : ""}
                />
                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">Fecha</label>
                  <div className="col">
                    <input
                      type="datetime-local"
                      name="payment_date"
                     
                      aria-label="Fecha de pago"
                    />
                  </div>
                </div>
                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">Monto</label>
                  <div className="col-6">
                    <input
                      type="number"
                      name="amount"
                      step="0.01"
                      ref={register()}
                      className={`form-control ${
                        errors.amount ? "is-invalid" : ""
                      }`}
                      aria-label="Monto"
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="row align-items-center mb-4">
                  <label className="col-3 col-form-label">Método de pago</label>
                  <div className="col">
                    <select
                      name="method"
                      ref={register()}
                      className={`form-control ${
                        errors.method ? "is-invalid" : ""
                      }`}
                      aria-label="Método de pago"
                    >
                      <option value="">---</option>
                      {dataTypes?.paymentTypes?.map((type, index) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="row align-items-center">
                  <label className="col-3 col-form-label">Notas</label>
                  <div className="col">
                    <textarea
                      name="notes"
                      rows="2"
                      ref={register()}
                      className={`form-control ${
                        errors.notes ? "is-invalid" : ""
                      }`}
                      aria-label="Notas"
                    ></textarea>
                  </div>
                </div>
                {/* agregar checkbox para envío de correo */}
              </form>
            </ModalBody>
            <ModalFooter className="text-right">
              <button
                className="btn btn-green"
                form="frm_payment_register"
                type="submit"
                disabled={loadingSave}
              >
                Registrar
              </button>{" "}
              <button className="btn btn-light-green" onClick={toggle}>
                Cerrar
              </button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={modalError}
            toggle={toggleModalError}
            className="modal-dialog-centered danger"
          >
            <ModalBody className="text-center">
              <img
                src={warning_icon}
                alt="Warning Icon"
                className="svg_icon mb-4"
              />
              <h5>{modalMsg.title}</h5>
              <p>{modalMsg.msg}</p>
            </ModalBody>
            <ModalFooter className="text-center">
              <Button color="danger" onClick={toggleModalError}>
                Cerrar
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
      <div className="row">
        <div className="col-9">
          {invoice ? (

          
            <div className="card invoice_card"  id="content" >
              <div    className="card-body">
 
                <div className="row align-items-center">
                  <div className="col">
                    <small className="small-text">
                      {format_date(invoice.emission_date)}
                    </small>
                    <h5 className="invoice_number mb-0">
                      Factura {invoice.invoice_number}
                    </h5>
                  </div>
                  <div className="col-6 text-right">
                    <div className="status_box mr-2">{invoice.status}</div>
                    {invoice.pending_balance > 0 ? (
                      <div className="status_box mr-2 danger">No pagada</div>
                    ) : (
                      <div className="status_box mr-2 success">Pagada</div>
                    )}
                    {invoice.pending_balance > 0 &&
                    invoice.credit?.time_limit &&
                    invoice.credit?.amount ? (
                      compare_dates_lt_today(invoice.credit?.time_limit) ? (
                        <div className="status_box mr-2 warning">Vencida</div>
                      ) : null
                    ) : null}
                  </div>
                </div>

                <hr className="mt-4 mb-4" />

                <div className="row">
                  <div className="col">
                    <div className="invoice_company">
                      <h4 className="company mb-3">LoxaDev</h4>
                      <p className="mb-0"><h6 className="mb-0"> RUC 1100000000001 </h6></p>
                      <p>
                        <a href="mailto:"><h6 className="mb-0"> billing@loxadev.com </h6></a>
                      </p>
                      <p className="mb-0"><h6 className="mb-0"> 4246 Paul Wayne Haggerty Road </h6></p>
                      <p className="mb-0"> <h6 className="mb-0">  Loja - Ecuador </h6></p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="invoice_info">
                      <h5>Autorización</h5>
                      <small className="small-text"> <h6 className="mb-0"> Número </h6></small>
                      <p className="mb-1">  <h6 className="mb-0"> Sin definir</h6></p>
                      <small className="small-text"><h6 className="mb-0"> Fecha </h6></small>
                      <p className="mb-1"> <h6 className="mb-0"> Sin definir </h6></p>
                      <small className="small-text"> <h6 className="mb-0"> Clave de acceso </h6></small>
                      <p className="mb-1">
                      <h6 className="mb-0">
                        1303202101110533501000110010020000000022107348011
                        </h6>
                      </p>
                    </div>
                  </div>
                </div>

                <hr className="mt-4 mb-4" />

                <div className="row align-items-center">
                  <div className="col">
                    <div className="invoice_info">
                      <small className="small-text">Cliente</small>
                      <h6>
                        <Link to={"/cuentas/cliente"} className="green">
                          {invoice.customer.reference
                            ? invoice.customer.reference.business_name
                            : "Consumidor Final"}
                        </Link>
                      </h6>

                      {invoice.customer.reference ? (
                        <>
                          <p className="mb-0">
                            {invoice.customer.reference.dni_type === "RUC"
                              ? "RUC"
                              : "CED"}{" "}
                            {invoice.customer.reference.dni}
                          </p>
                          <p className="mb-0">{invoice.customer.email}</p>
                          <p className="mb-0">{invoice.customer.address}</p>
                          <p className="mb-0">
                            Tel. {invoice.customer.reference.phone_number}
                          </p>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="col">
                    <div className="row align-items-center">
                      <div className="col">
                        <div className="invoice_info">
                          <small className="small-text">Monto Total</small>
                          <h6 className="mb-4">
                            $ {parseFloat(invoice.total).toFixed(2)}
                          </h6>
                          <small className="small-text">Monto Pagado</small>
                          <h6 className="mb-0">
                            $ {parseFloat(invoice.total_paid).toFixed(2)}
                          </h6>
                        </div>
                      </div>
                      <div className="col">
                        <div className="invoice_info">
                          <small className="small-text">Monto Pendiente</small>
                          <h4>
                            $ {parseFloat(invoice.pending_balance).toFixed(2)}
                          </h4>
                          {invoice.credit?.time_limit ? (
                            <div className="due_date">
                              Vence: {format_date(invoice.credit?.time_limit)}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="mt-4 mb-4" />

                <div className="row align-items-center">
                  <div className="col">
                    <h5 className="mb-0">Impuestos</h5>
                  </div>
                  <div className="col">
                    <div className="row align-items-center">
                      <div className="col">
                        <div className="invoice_info">
                          <small className="small-text">Valor IVA</small>
                          <h6 className="mb-0">
                            $ {parseFloat(invoice.iva_value).toFixed(2)}
                          </h6>
                        </div>
                      </div>
                      <div className="col">
                        <div className="invoice_info">
                          <small className="small-text">Valor ICE</small>
                          <h6 className="mb-0">
                            $ {parseFloat(invoice.ice_value).toFixed(2)}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="mt-4 mb-4" />

                <h5 className="mb-3">Retenciones</h5>
                <div className="row align-items-center">
                  <div className="col">
                    <div className="invoice_info">
                      <small className="small-text">
                        Información adicional
                      </small>
                      <p className="mb-0">
                        {invoice.aditional_information
                          ? invoice.aditional_information
                          : "Sin especificar."}
                      </p>
                    </div>
                  </div>
                  <div className="col">
                    <div className="row align-items-center">
                      <div className="col">
                        <div className="invoice_info">
                          <small className="small-text">Retención Renta</small>
                          <h6 className="mb-0">
                            $ {parseFloat(invoice.retentions.rental).toFixed(2)}
                          </h6>
                        </div>
                      </div>
                      <div className="col">
                        <div className="invoice_info">
                          <small className="small-text">Retención IVA</small>
                          <h6 className="mb-0">
                            $ {parseFloat(invoice.retentions.iva).toFixed(2)}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="mt-4 mb-4" />

                <h5 className="mb-3">Detalle</h5>
                <table className="table card_table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio Unit.</th>
                      <th>Descuento</th>
                      <th className="text-center">Cant.</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => {
                      let discount_value =
                        (item.subtotal * item.discount) / 100;
                      return (
                        <tr key={index}>
                       
                          <td>  <h6 className="mb-0"> {item.product.description}</h6></td>
                          <td>  <h6 className="mb-0">  $ {parseFloat(item.price).toFixed(2)} </h6></td>
                          <td><h6 className="mb-0">
                            ${" "}
                            {discount_value
                              ? parseFloat(discount_value).toFixed(2)
                              : "-"}
                              </h6>
                          </td>
                          <td className="text-center"> <h6 className="mb-0"> {item.quantity} </h6> </td>
                          <td> <h6 className="mb-0"> 
                            ${" "}
                            {parseFloat(
                              item.subtotal -
                                (discount_value ? discount_value : 0)
                            ).toFixed(2)}
                            </h6>
                          </td>
                          
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {payments && payments.length > 0 ? (
                  <>
                    <hr className="mt-4 mb-4" />

                    <h5 className="mb-3">Pagos</h5>
                    <table className="table card_table">
                      <thead>
                        <tr>
                          <th>Método de pago</th>
                          <th>Fecha</th>
                          <th>Notas</th>
                          <th>Monto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment, index) => {
                          return (
                            <tr key={index}>
                              <td><h6 className="mb-0"> {payment.method.name}</h6></td>
                              <td><h6 className="mb-0">
                                {format_date_w_time(payment.payment_date)}
                                </h6></td>
                              <td> <h6 className="mb-0">{payment.notes ? payment.notes : "N/D"}</h6></td>
                              <td><h6 className="mb-0"> $ {parseFloat(payment.amount).toFixed(2)}</h6></td>

                              
                           
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                ) : null}
              </div>
            </div>

             
          ) : null}
        </div>




      




        <div  id="elementH"  className="col-3">
          <h5 className="mb-4">Actividad reciente</h5>
          <div className="activity_box">
            <div className="activity_box_body">
              <h6 className="action">Factura generada</h6>
              <p className="description mb-0">
                Factura creada por <i>admin</i>
              </p>
              <small className="date">Fecha: 31/02/2021</small>
            </div>
          </div>
          <div className="activity_box">
            <div className="activity_box_body">
              <h6 className="action">Factura editada</h6>
              <p className="description mb-0">
                Se registró un pago en Transferencia Bancaria por $20.00 al
                generar la factura por <i>admin</i>
              </p>
              <small className="date">Fecha: 31/02/2021</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillView;
