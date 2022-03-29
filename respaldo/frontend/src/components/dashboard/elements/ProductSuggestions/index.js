import React, { useState, useEffect } from "react";
import Autosuggest from 'react-autosuggest';
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

import { useLazyQuery } from "@apollo/client";
import { GET_SUGGESTIONS } from "../../../../graphql/queries/product.queries";

import { suggestions as constant_suggestions } from "../../../../helpers/constants";

const ProductSuggestions = ({ 
    placeholder, 
    className, 
    autoFocus, 
    products, 
    setProducts,
    type,
  }) => {
  const [suggestions, setSuggestions] = useState([]);	
  const [valueProduct, setValueProduct] = useState('');

  const [getSuggestions, { loading, data, error }] = useLazyQuery(GET_SUGGESTIONS, {
    fetchPolicy: "network-only"
  });

	useEffect(() => {
    if(!loading && data){
      const { productSuggestions } = data;

      if(productSuggestions.length > 0)
        setSuggestions(productSuggestions);
      else
        setSuggestions([
          { 
            id: uuidv4(),
            new: true,
            description: valueProduct, 
            code: "",
            prices: [{ value: 0 }],
            cost: 0,
            discount: 0,
            taxes: [] 
          }
        ]);
    }
  // eslint-disable-next-line
  }, [data, loading]);

	useEffect(() => {
		if(error){
			console.log("[ERROR] " + error);
		}
	}, [error]);

	const onSuggestionsFetchRequested = ({ value }) =>{
    const inputValue = value?.trim().toLowerCase();
    const inputLength = inputValue.length;
    if(inputLength > 2){
      getSuggestions({ variables: { search: inputValue } });
    }
  };

	const onSuggestionsClearRequested = () =>{
    setSuggestions([]);
  };

	const onSuggestionSelected = (event, { suggestion }) => {
    setValueProduct('');

    if(type === constant_suggestions.ISSUED && suggestion.new){
      console.log("Desplegar modal!");
    }else{
      const new_product = {
        id: suggestion.id,
        code: suggestion.code,
        description: suggestion.description,
        quantity: 1,
        price: type === constant_suggestions.ISSUED ? suggestion.prices[0].value : suggestion.cost,
        taxes: suggestion.taxes,
        new: suggestion.new,
        discount: suggestion.discount ? suggestion.discount:0,
      };

      const product_list = [...products, {...new_product}];
      setProducts(product_list);
    }
  };

	const getSuggestionValue = suggestion => suggestion.code +' - '+ suggestion.description;

  const renderSuggestion = suggestion => {
    if(!suggestion.new){
      return (
        <div>
          {suggestion.code ? suggestion.code:'<Sin código>'} - {suggestion.description}
        </div>
      );
    }else{
      return (
        <div>
          Añadir "{suggestion.description}"
        </div>
      );
    }
  };

  const onSearchChange = (event, { newValue }) =>{
    setValueProduct(newValue);
  };

	const renderInputComponent = inputProps => (
    <div className="auto_input">
      <div className="input-group mb-0">
        <div className="input-group-prepend">
          <div className="input-group-text"><i className="bi bi-search" /></div>
        </div>
        <input { ... inputProps } />
      </div>
    </div>
  );  

  const inputProps = {
    placeholder: placeholder,
    value: valueProduct,
    onChange: onSearchChange,
    className: className,
		autoFocus: autoFocus,
  };

	return (
		<Autosuggest 
			suggestions={suggestions}
			onSuggestionsFetchRequested={onSuggestionsFetchRequested}
			onSuggestionsClearRequested={onSuggestionsClearRequested}
			onSuggestionSelected={onSuggestionSelected}
			renderInputComponent={renderInputComponent}
			getSuggestionValue={getSuggestionValue}
			renderSuggestion={renderSuggestion}
			inputProps={inputProps}
			id='products-suggestions'
		/>
	);
};

ProductSuggestions.propTypes = {
	placeholder: PropTypes.string,
	className: PropTypes.string,
	autoFocus: PropTypes.bool,
	products: PropTypes.array.isRequired,
	setProducts: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

ProductSuggestions.defaultProps = {
	placeholder: "Busca y añade un producto a la lista...",
	className: "form-control",
	autoFocus: false
};

export default ProductSuggestions;