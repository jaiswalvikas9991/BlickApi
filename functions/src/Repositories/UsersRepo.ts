import UserModel from '../Models/UserModel';
import Firestore from '../Firestore';

export default class UsersRepo extends Firestore {
    private static _instance?: UsersRepo = undefined;
    constructor() { super(); }


    public static get Instance(): UsersRepo {
        if (this._instance === undefined) this._instance = new this();
        return (this._instance);
    }

    public async getUserDataByUid (uid: string): Promise<{}>{
        const data: {} = await super.getUserDataByUid(uid);
        //console.log(data);
        //const user: UserModel = new UserModel(0, "");
        return (data);
    }

    public async getBuildingInfoById(id : string) {
        const data : {} = await super.getBuildingInfoById(id);
        return(data);
    }

    public async getUsersInfoByFlat(buildingId : string, flatId : string) {
        const data : {} = await super.getUsersInfoByFlat(buildingId, flatId);
        return(data);
    }


    public async getAllUsersByBuilding(buildingId: string): Promise<UserModel[]>{
        const data: Array<{}> = await super.getAllUsersByBuilding(buildingId);
        //* Converting the raw data to the UserModel
        const users: UserModel[] = new Array<UserModel>();
        data.forEach((user: {}) => {
            users.push(new UserModel("404", ""));
        });
        return (users);
    }
}