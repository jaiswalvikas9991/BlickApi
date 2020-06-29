import UsersService from "../Services/UsersService";

const Resolvers = {
    user : UsersService.getUserDataByUid,
    buildingInfo : UsersService.getBuildingInfoById,
    usersInfoByFlat : UsersService.getUsersInfoByFlat
};

export default Resolvers;