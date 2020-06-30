import { buildSchema } from 'graphql';

const Schema = buildSchema(`
    type BuildingInfo {
        address : String
    }

    type Car {
        car_number : String!
        created_on : String
    }
    
    type Guest {
        car_number : String!
        created_on : String
        end_time : String
    }

    type PhoneNumber {
        phoneNumber : Int!
        createdOn : String
    }

    type User{
        email : String
        building_id : String
        flat_id : String
        cars : [Car]
        guests : [Guest]
        phone_numbers : [PhoneNumber]
    }

    type UserInfo {
        email : String!
        auth_status : String
    }

    type Users {
        admin_user : UserInfo!
        secondary_user : [UserInfo]
    }

    type RootQuery{
        user : User!
        usersInfoByFlat : Users
        buildingInfo : BuildingInfo
    }

    schema{
        query : RootQuery
    }
`);

export default Schema;