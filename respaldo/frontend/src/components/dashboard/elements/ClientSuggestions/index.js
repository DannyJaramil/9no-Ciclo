import React, { useState, useEffect } from "react";
import Autosuggest from 'react-autosuggest';
import PropTypes from "prop-types";

import { useLazyQuery } from "@apollo/client";
import { GET_SUGGESTIONS as CUSTOMER_SUGGESTIONS } from "../../../../graphql/queries/user.queries";

const ClientSuggestions = ({ 
  placeholder, 
  className, 
  autoFocus, 
  setCustomer, 
  defaultValue,
  inputRef
}) => {
	const [customers, setCustomers] = useState([]);
  const [valueCustomer, setValueCustomer] = useState('');

	const [getCustomers, { data, loading, error }] = useLazyQuery(CUSTOMER_SUGGESTIONS, {
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    if(defaultValue?.dni && defaultValue?.business_name)
      setValueCustomer(defaultValue.dni + " - " + defaultValue.business_name);
    else
      setValueCustomer('');
  }, [defaultValue]);

	useEffect(() => {
    if(!loading && data){
      setCustomers(data.customerSuggestions);
    }
  }, [loading, data]);

  useEffect(() => {
		if(error){
			console.log("[ERROR] " + error);
		}
	}, [error]);

	const onCustomerSuggestionsFetchRequested = ({ value }) =>{
    const inputValue = value?.trim().toLowerCase();
    const inputLength = inputValue.length;
    if(inputLength > 0){
      getCustomers({ variables: { search: inputValue } });
    }
  };

  const onCustomerSuggestionsClearRequested = () =>{
    setCustomers([]);
  };

  const onCustomerSuggestionSelected = (event, { suggestion }) =>{
    setCustomer({ reference: suggestion.id, email: suggestion.account.email, address: suggestion.address });
  };

	const getCustomerSuggestionValue = suggestion => suggestion.dni +' - '+ suggestion.business_name;

  const renderCustomerSuggestion = suggestion => (
    <div>
      {suggestion.dni} - {suggestion.business_name}
    </div>
  );

  const onCustomerSearchChange = (event, { newValue }) =>{
    setValueCustomer(newValue);
    if(!newValue && newValue.length === 0){
      setCustomer({ reference: '', email: '', address: '' });
    }
  }

	const inputCustomerProps = {
    placeholder: placeholder,
    value: valueCustomer,
    onChange: onCustomerSearchChange,
    className: className,
    autoFocus: autoFocus,
    ref: inputRef
  };
	
	return (
		<Autosuggest 
			suggestions={customers}
			onSuggestionsFetchRequested={onCustomerSuggestionsFetchRequested}
			onSuggestionsClearRequested={onCustomerSuggestionsClearRequested}
			onSuggestionSelected={onCustomerSuggestionSelected}
			getSuggestionValue={getCustomerSuggestionValue}
			renderSuggestion={renderCustomerSuggestion}
			inputProps={inputCustomerProps}
			id='customers-suggestions'
		/>
	);
};

ClientSuggestions.propTypes = {
	placeholder: PropTypes.string,
	className: PropTypes.string,
	autoFocus: PropTypes.bool,
	setCustomer: PropTypes.func,
  defaultValue: PropTypes.object,
  ref: PropTypes.object
};

ClientSuggestions.defaultProps = {
	placeholder: "",
	className: "form-control",
	autoFocus: false
};

export default ClientSuggestions;