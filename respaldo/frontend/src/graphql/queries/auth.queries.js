import { gql } from "@apollo/client";

export const CURRENT = gql`
    query GetCurrent{
        current{
            id
            email
            user{
                business_name
                tradename
            }
        }
    }`;