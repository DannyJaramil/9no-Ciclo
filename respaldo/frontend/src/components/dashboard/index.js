import React, { useRef } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import routes from "./routes";

import Sidebar from "./layout/sidebar";
import Topbar from "./layout/topbar";

const Dashboard = (props) => {
	const mainContent = useRef(null);

	const getRoutes = (routes) =>
		routes.map((item, key) => {
			if (item.children) {
				const items = item.children.map((child, key) => {
					return (
						<Route
							exact
							path={'/panel' + item.path + child.path}
							component={child.component}
							key={key}
						/>
					);
				});

				items.push(
					<Route
						exact
						path={'/panel' + item.path}
						component={item.component}
						key={key}
					/>
				);

				return items;
			}

			return (
				<Route
					exact
					path={'/panel' + item.path}
					component={item.component}
					key={key}
				/>
			);
		});

	const getCurrent = (location) => {
		const path = location.split('/');
		if (path[2]) {
			const route = routes.find(item => item.path.includes(path[2]));
			return route;
		}

		return routes[0];
	}

	return (
		<>
			<Sidebar
				{...props}
				routes={routes}
			/>
			<div className="main_content" ref={mainContent}>
				<Topbar
					{...props}
					current={getCurrent(props.location.pathname)} />
				<Switch>
					{getRoutes(routes)}
					<Redirect from="*" to="/" />
				</Switch>

				<div className="container-fluid">
					<div className="row">
						<div className="col">
							<p className="copyright mb-0">&copy; LoxaFac 2021. Todos los derechos reservados.</p>
						</div>
					</div>
				</div>
			</div>
		</>
	)
};

export default Dashboard;