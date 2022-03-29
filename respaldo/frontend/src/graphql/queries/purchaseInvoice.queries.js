import { gql } from "@apollo/client";

export const GET_PURCHASE_INVOICES = gql`
	query GetInvoices($offset: Int!, $limit: Int!, $queries: Queries) {
		purchaseInvoices(offset: $offset, limit: $limit, queries: $queries) {
			invoices {
				id
				provider {
					id
					business_name
					tradename
				}
				invoice_number
				emission_date
				total
				status
				pending_balance
			}
			total
		}
	}
`;

export const GET_PURCHASE_INVOICE = gql`
query GetPurchaseInvoice($id: ID!) {
	purchaseInvoice(id: $id) {
		id
		provider {
			id
			business_name
			tradename
			dni_type
			dni
			phone_number
			address
			account {
				email
			}
		}
		emission_date
		max_payment_date
		referral_guide
		items {
			product {
				id
				code
				description
				measurement_unit
				taxes {
					type
					name
					percentage
				}
			}
			quantity
			price
			discount
			subtotal
		}
		subtotal
		iva_value
		ice_value
		total
		pending_balance
		total_paid
		invoice_number
		status
		auth_number
		modified_at
	}
}
`;