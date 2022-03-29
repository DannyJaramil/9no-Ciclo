import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const EmptyBox = (props) => {
  return (
    <div className="empty_box">
      <span className="description">{props.description}</span>
      {props.to && (
        <Link className={props.btnClassName} to={props.to}>
          {props.btnLabel}
        </Link>
      )}
    </div>
  );
};

EmptyBox.propTypes = {
  description: PropTypes.string,
  to: PropTypes.string,
  btnLabel: PropTypes.string,
  btnClassName: PropTypes.string,
};

EmptyBox.defaultProps = {
  description: "No se han encontrado elementos para mostrar.",
  btnLabel: "Añadir nuevo",
  btnClassName: "btn btn-secondary",
};

export default EmptyBox;
