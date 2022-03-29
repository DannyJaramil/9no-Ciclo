import { gql } from "@apollo/client";

export const GET_PAYMENTS = gql`
	query GetPayments($offset: Int!, $limit: Int!, $queries: Queries){
		payments(offset: $offset, limit: $limit, queries: $queries){
			payments{
				id
				invoice{
					id
					customer{
						reference{
							business_name
							tradename
						}
					}
					invoice_number
				}
				method{
					name
				}
				amount
				payment_date
				created_at
				notes
			}
			total
		}
	}
`;

export const GET_PAYMENTS_BY_ID = gql`
	query GetPaymentsById($id: ID!){
		paymentsById(id: $id){
			id
			amount
			payment_date
			method{
				id
				name
			}
			notes
		}
	}
`;