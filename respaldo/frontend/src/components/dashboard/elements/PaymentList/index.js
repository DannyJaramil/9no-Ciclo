import React, { useState } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

import { useQuery } from "@apollo/client";
import { GET_PAYMENT_TYPES } from "../../../../graphql/queries/paymentType.queries";

import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";

import warning_icon from "../../../../assets/img/warning.svg";

const PaymentList = ({
	payments,
	setPayments,
	limit
}) => {
	const [modal, setModal] = useState(false);
  const [modalMsg, setModalMsg] = useState({ title: '', msg: '' });
	
	// MODAL
	const toggle = () => setModal(!modal);

	// QUERIES
	const { data: dataTypes } = useQuery(GET_PAYMENT_TYPES, {
		fetchPolicy: "cache-and-network"
	}); // Payment Types

	// LIST FUNCTIONS
	const changeValues = (index, name, value) => {
		const payment_list = payments.map((payment, i) => {
			if (i === index) {
				if (name === 'amount' && !isNaN(parseFloat(value)) && limit) {
					const new_payment = { ...payment };
					let calculated_limit = parseFloat(limit) + (!isNaN(parseFloat(new_payment.amount)) ? parseFloat(new_payment.amount) : 0);
					if (parseFloat(value) <= calculated_limit) {
						new_payment[name] = value;

						if (new_payment.error)
							delete new_payment.error;

					} else {
						new_payment.error = true;
						
						setModalMsg({
							title: 'Datos incorrectos',
							msg: 'El valor que intenta ingresar sobrepasa el saldo pendiente.'
						});    

						toggle();
					}

					return new_payment;
				} else {
					const new_payment = { ...payment };
					new_payment[name] = value;

					return new_payment;
				}
			}

			return { ...payment };
		});

		if ((payments.length - 1) === index) {
			payment_list.push({
				id: uuidv4(),
				method: '',
				amount: 0,
				notes: ''
			});
		}

		setPayments(payment_list);
	};

	const removePayment = index => {
		const payment_list = payments.filter((payment, i) => i !== index);
		setPayments(payment_list);
	};

	return (
		<>
			<div className="bordered_box mb-5">
				<div className="row">
					<div className="col">
						<h6 className="title_box">Información de pagos</h6>
						<hr />
						<div className="header_list">
							<div className="row">
								<div className="col">Método de pago</div>
								<div className="col-3">Monto</div>
								<div className="col-3">Notas</div>
								<div className="col-1 text-center">A</div>
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col">
						{payments.map((payment, index) => (
							<div className="list_item" key={payment.id}>
								<div className="row align-items-center">
									<div className="col">
										<select
											className={`form-control`}
											onChange={e => changeValues(index, 'method', e.target.value)}
											disabled={!isNaN(parseFloat(limit)) && parseFloat(limit) <= 0}>
											<option value='' disabled={(payments.length - 1) !== index}>---</option>
											{dataTypes?.paymentTypes?.map((type, index) => (
												<option key={type.id} value={type.id}>{type.name}</option>
											))}
										</select>
									</div>
									<div className="col-3">
										<input
											type="number"
											step="0.1"
											onChange={e => changeValues(index, 'amount', e.target.value)}
											className={`form-control ${payment.error ? 'is-invalid' : ''}`}
											disabled={(payments.length - 1) === index || (!isNaN(parseFloat(limit)) && parseFloat(limit) <= 0)}
											value={payment.amount}
											aria-label="Monto"
											autoComplete="off"
											placeholder="Monto"
										/>
									</div>
									<div className="col-3">
										<input
											type="text"
											className={`form-control`}
											value={payment.notes}
											onChange={e => changeValues(index, 'notes', e.target.value)}
											aria-label="Notas"
											autoComplete="off"
											placeholder="Notas"
										/>
									</div>
									<div className="col-1 text-center">
										<div className="options">
											{(payments.length - 1) !== index ?
												<button
													type="button"
													className="btn btn-secondary"
													onClick={() => removePayment(index)}
												>
													<i className="bi bi-trash-fill" />
												</button> : <span className="dummy_box" style={{ display: 'inline-block', width: '50px' }}></span>
											}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<Modal isOpen={modal} toggle={toggle} className='modal-dialog-centered danger'>
        <ModalBody className="text-center">
          <img src={warning_icon} alt="Warning Icon" className="svg_icon mb-4" />
          <h5>{ modalMsg.title }</h5>
          <p>{ modalMsg.msg }</p>
        </ModalBody>
        <ModalFooter className="text-center">
          <Button color="danger" onClick={toggle}>Cerrar</Button>
        </ModalFooter>
      </Modal>
		</>
	);
};

PaymentList.propTypes = {
	payments: PropTypes.array.isRequired,
	setPayments: PropTypes.func.isRequired,
	limit: PropTypes.number
};

export default PaymentList;