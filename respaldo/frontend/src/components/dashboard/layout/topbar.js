import React from "react";
import { NavLink as Link } from "react-router-dom";

const Topbar = ({ current, location }) => {
  const generateLinks = () => {
    if (current && current.children.length > 0) {
      return (
        <ul className="list-inline mb-0 text-right">
          {current.children.map((item, key) => {
            if (item.visible) {
              return (
                <li className="list-inline-item" key={key}>
                  <Link
                    className="btn btn-primary"
                    to={"/panel" + current.path + item.path}
                    activeClassName="active"
                  >
                    {item?.name}
                  </Link>
                </li>
              );
            } else return null;
          })}
        </ul>
      );
    }
  };

  const getBreadcrumbs = (location) => {
    const { children } = current;
    const path = location.split("/");
    if (path[3]) {
      const child = children.find((item) => item.path.includes(path[3]));
      return (
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to={current ? "/panel" + current?.path : "/panel"}>
                {current ? current?.name : "Tablero"}
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {child?.name}
            </li>
          </ol>
        </nav>
      );
    }

    return (
      <p className="mb-0 subtitle">
        Vista principal de {current ? current?.name : "Tablero"}
      </p>
    );
  };

  return (
    <div id="topbar" className="topbar">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-4">
            <h5 className="title mb-1">
              {current ? current?.name : "Tablero"}
            </h5>
            {getBreadcrumbs(location.pathname)}
          </div>
          <div className="col-8">{generateLinks()}</div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
