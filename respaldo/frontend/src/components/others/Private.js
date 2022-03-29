import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";

import { toast } from "react-toastify";

import { useQuery } from "@apollo/client";
import { CURRENT } from "../../graphql/queries/auth.queries";

import { history } from "../../helpers/history";

const PrivateComponent = ({ component: Component, ...rest }) => {
	const { data, error } = useQuery(CURRENT);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if(data){
			setIsLoading(false);
		}else if(error){
			toast.error("Inicie sesión antes de continuar.");			
			localStorage.removeItem('auth');
			history.push(`/`);
		}
	}, [data, error]);

	return isLoading ? (
		<div className="container-fluid">
			<div className="row">
				<div className="col">
					<p>Cargando...</p>
				</div>
			</div>
		</div>
	):(
		<Route 
			{...rest}
			render={(props) => <Component {...props} />}
		/>
	);
};

export default PrivateComponent;