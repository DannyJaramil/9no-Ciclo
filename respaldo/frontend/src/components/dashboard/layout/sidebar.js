import React from "react";
import { NavLink as Link } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { CURRENT } from "../../../graphql/queries/auth.queries";

import { history } from "../../../helpers/history";

const Sidebar = ({ routes }) => {
  const { client } = useQuery(CURRENT);
  const generateLinks = (routes) => {
    return routes.map((item, key) => {
      if (item.visible) {
        return (
          <Link
            className="menu_item"
            to={"/panel" + item.path}
            activeClassName="active"
            key={key}
          >
            <i className={item.icon}></i>
            {item.name}
          </Link>
        );
      }

      return null;
    });
  };

  const logout = () =>{
    localStorage.removeItem('auth');
    history.push(`/`);
    client.clearStore();
  };

	return (
		<div id="sidebar" className="main_sidebar">
      <div className="box_logo">
        <Link to="/panel">
          Loxa<span>Fac.</span>
        </Link>
      </div>
      <div className="box_options">
        <button className="btn btn-option mr-2" onClick={e => logout()}><i className="bi bi-box-arrow-left"></i></button>
        <Link to="/panel/to-profile" className="btn btn-option"><i className="bi bi-person-fill"></i></Link>
      </div>
      <div className="box_menu">
        <span className="title">Menu</span>
        {generateLinks(routes)}
      </div>
    </div>
  );
};

export default Sidebar;
