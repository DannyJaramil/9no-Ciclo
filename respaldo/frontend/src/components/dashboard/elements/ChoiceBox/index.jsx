import React from "react";
import { NavLink as Link } from "react-router-dom";
import PropTypes from "prop-types";

const ChoiceBox = ({
	title,
	description,
	link_to,
	content_link,
	icon
}) => {
	return (
		<div className="choice_box mb-4">
			{ icon ? (
				<img src={icon} alt="Choice Box Icon" className="svg_icon mb-4" />
			): null }
			<h5 className="title">{ title }</h5>
			<p className="description mb-4">{ description }</p>
			<Link to={link_to} className="btn btn-green">
				{ content_link }
			</Link>
		</div>
	);
};

ChoiceBox.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	link_to: PropTypes.string.isRequired,
	content_link: PropTypes.string.isRequired,
	icon: PropTypes.any
};

export default ChoiceBox;