import React from "react";
import EmptyBox from "../../../others/EmptyBox";

const Listing = (props) => {
	return (
		<div className="container-fluid">
			<div className="row mb-4">
				<div className="col-4">
					<form className="search_form">
						<div className="input-group mb-2">
							<div className="input-group-prepend">
								<div className="input-group-text">
									<i className="bi bi-search" />
								</div>
							</div>
							<input
								type="text"
								className="form-control"
								placeholder="Buscar..."
							/>
						</div>
					</form>
				</div>
			</div>
			<div className="row">
				<div className="col-12">
					<EmptyBox to={"/panel/nuevo/recibidos/nuevo"} />
				</div>
			</div>
		</div>
	);
};

export default Listing;