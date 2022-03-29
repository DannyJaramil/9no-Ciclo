import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const DropdownComponent = ({ icon, options }) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const toggle = () => setDropdownOpen(prevState => !prevState);

	return(
		<Dropdown isOpen={dropdownOpen} toggle={toggle} style={{ display: 'inline-block' }}>
			<DropdownToggle className="btn-secondary">
				<i className="bi bi-three-dots-vertical" />
			</DropdownToggle>
			<DropdownMenu right>
				{ options.map((option, index) => {
					if(option.type === "text")
						return (
							<DropdownItem onClick={option.action} key={index}>
								{ option.text }
							</DropdownItem>
						);
					else
						return (
							<DropdownItem divider key={index} />
						);
				}) }
			</DropdownMenu>
		</Dropdown>
	);
};

DropdownComponent.propTypes = {
  options: PropTypes.array.isRequired,
	icon: PropTypes.string
};

DropdownComponent.defaultProps = {
	icon: "bi bi-three-dots-vertical"
};

export default DropdownComponent;