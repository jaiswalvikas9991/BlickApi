import { buildSchema } from 'graphql';

const Schema = buildSchema(`


    type Car {
        carNumber : String!
        createdOn : String
    }
    
    type Guest {
        car : Car!
        createdOn : String
    }

    type PhoneNumber {
        phoneNumber : Int!
        createdOn : String
    }

    type User{
        email : String
        flat_no : String
        cars : [Car]
        guests : [Guest]
        phone_numbers : [PhoneNumber]
    }

    type RootQuery{
        user : User!
    }

    schema{
        query : RootQuery
    }
`);

export default Schema;