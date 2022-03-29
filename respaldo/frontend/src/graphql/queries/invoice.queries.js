import { gql } from "@apollo/client";

export const GET_INVOICES = gql`
  query GetInvoices($offset: Int!, $limit: Int!, $queries: Queries) {
    invoices(offset: $offset, limit: $limit, queries: $queries){
      invoices{
        id
        emission_date
        total
        status
        customer{
          reference{
            business_name
            tradename
          }
        }
        invoice_number
        pending_balance
      }
      total
    }
  }
`;

export const GET_INVOICE = gql`
  query GetInvoice($id: ID!){
    invoice(id: $id){
      id
      customer{
        reference{
          id
          business_name
          tradename
          dni_type
          dni
          phone_number     
        }
        address
        email
      }
      emission_date
      emission_point
      referral_guide
      items{
        product{
          id
          code
          description
          measurement_unit
          taxes{
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
      aditional_information
      subtotal
      iva_value
      ice_value
      total
      pending_balance
      total_paid
      credit{
        time_limit
        amount
      }
      retentions{
        rental
        iva
      }
      invoice_number
      status
      authorized
      modified_at
    }
  }
`;