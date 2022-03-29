import { months } from "./constants";

export const format_date = input => {
	var value = parseInt(input);
	var date;

	if(!isNaN(value))
  		date = new Date(value);
	else
		date = new Date(input);

	return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const format_date_w_time = input => {
	var value = parseInt(input);
	var date;

	if(!isNaN(value))
  		date = new Date(value);
	else
		date = new Date(input);

	return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
};

export const compare_dates_lt_today = (input) => {
	var today = new Date();

	var value = parseInt(input);
	var date;

	if(!isNaN(value))
  	date = new Date(value);
	else
		date = new Date(input);

	return today.getTime() >= date.getTime();
};