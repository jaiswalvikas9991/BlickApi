import Database from '../Firestore';
import UserModel from '../Models/UserModel';

export default abstract class UsersRepo {
    private constructor() { }

    public static getAllUsersByBuilding = async (buildingId: string): Promise<UserModel[]> => {
        const data: Array<{}> = await Database.Instance.getAllUsersByBuilding(buildingId);
        //* Converting the raw data to the UserModel
        const users: UserModel[] = new Array<UserModel>();
        data.forEach((user: {}) => {
            users.push(new UserModel(404, ""));
        });
        return (users);
    };

    public static getUserDataByUid = async (uid: string): Promise<UserModel> => {
        const data: {} = await Database.Instance.getUserDataByUid(uid);
        console.log(data);
        const user: UserModel = new UserModel(404, "");
        return (user);
    };

    // public static setUser = async (user: User) => {
    //     // TODO : Implement the making of a new user
    // };
}