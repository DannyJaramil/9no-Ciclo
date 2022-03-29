import React from "react";
import ChoiceBox from "../elements/ChoiceBox";

import bill_icon from "../../../assets/img/bill.svg";
import shopping_basket_icon from "../../../assets/img/shopping-basket.svg";

const IndexVouchers = props => {
	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-6">
					<ChoiceBox 
						title="Comprobantes Emitidos"
						description="Facturas, guías de remisión, retenciones, etc."
						link_to={`/panel/facturacion/facturas`}
						content_link="Ir al listado"
						icon={bill_icon}
					/>
				</div>
				<div className="col-6">
					<ChoiceBox 
						title="Comprobantes Recibidos"
						description="Facturas, guías de remisión, retenciones, etc."
						link_to={`/panel/compras/facturas`}
						content_link="Ir al listado"
						icon={shopping_basket_icon}
					/>
				</div>
			</div>
		</div>
	);
};

export default IndexVouchers;