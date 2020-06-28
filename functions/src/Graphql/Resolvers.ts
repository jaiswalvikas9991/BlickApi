import UsersService from "../Services/UsersService";

const Resolvers = {
    user : UsersService.getUserDataByUid,
};

export default Resolvers;