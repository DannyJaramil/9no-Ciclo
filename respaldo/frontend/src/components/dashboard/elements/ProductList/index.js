import React from "react";
import PropTypes from "prop-types";

const ProductList = ({
	products,
	setProducts
}) => {
	const changeValues = (index, name, value) => {
		const product_list = products.map((product, i) => {
			if (i === index) {
				const new_product = { ...product };
				new_product[name] = value;

				return new_product;
			}

			return { ...product };
		});

		setProducts(product_list);
	};

	const removeProduct = index => {
		const product_list = products.filter((product, i) => i !== index);
		setProducts(product_list);
	};

	const calculateAmount = (quantity, rate) => {
		const quantityNumber = parseFloat(quantity);
		const rateNumber = parseFloat(rate);
		const amount = quantityNumber && rateNumber ? quantityNumber * rateNumber : 0

		return amount.toFixed(2);
	};

	return (
		<div className="bordered_box">
			<div className="row">
				<div className="col">
					<h6 className="title_box">Listado de productos</h6>
					<hr />
					<div className="header_list">
						<div className="row">
							<div className="col">Código</div>
							<div className="col-3">Producto</div>
							<div className="col text-center">Cantidad</div>
							<div className="col text-center">Precio unitario</div>
							<div className="col text-center">Descuento (%)</div>
							<div className="col text-center">Subtotal</div>
							<div className="col-1 text-center">A</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col">
					{products.map((item, index) => (
						<div className="list_item" key={item.id}>
							<div className="row align-items-center">
								<div className="col">
									{item.new ? (
										<input 
											type="text" 
											value={item.code}
											onChange={e => changeValues(index, 'code', e.target.value)} 
											className={`form-control text-uppercase`} 
											autoComplete="off" 
										/>
									) : (
										<b>{item.code}</b>
									)}
								</div>
								<div className="col-3">
									{item.new ? (
										<input 
											type="text" 
											value={item.description}
											onChange={e => changeValues(index, 'description', e.target.value)} 
											className={`form-control`} 
											autoComplete="off" 
										/>
									) : (
										item.description
									)}
								</div>
								<div className="col text-center">
									<input 
										type="number" 
										min="1" 
										step="1"
										value={item.quantity}
										onChange={e => changeValues(index, 'quantity', e.target.value)} 
										className={`form-control text-center`} 
										autoComplete="off" 
									/>
								</div>
								<div className="col text-center">
									<input 
										type="number" 
										step="0.01" 
										min="0" 
										value={item.price} 
										onChange={e => changeValues(index, 'price', e.target.value)} 
										className={`form-control text-center`} 
										autoComplete="off" 
									/>
								</div>
								<div className="col text-center">
									<input 
										type="number" 
										step="1" 
										min="0"
										max="100"
										value={item.discount} 
										onChange={e => changeValues(index, 'discount', e.target.value)} 
										className={`form-control text-center`} 
										autoComplete="off" 
									/>
								</div>
								<div className="col text-center">
									<input 
										type="text" 
										value={calculateAmount(item.quantity, item.price)} 
										className={`form-control text-center`} 
										autoComplete="off" 
										readOnly 
									/>
								</div>
								<div className="col-1 text-center">
									<div className="options">
										<button type="button" className="btn btn-secondary" onClick={e => removeProduct(index)}>
											<i className="bi bi-trash-fill" />
										</button>
									</div>
								</div>
							</div>
						</div>)
					)}
					{products.length === 0 ? (
						<p className="empty_msg">No hay elementos añadidos.</p>
					) : null}
				</div>
			</div>
		</div>
	);
};

ProductList.propTypes = {
	products: PropTypes.array.isRequired,
	setProducts: PropTypes.func.isRequired,
};

export default ProductList;