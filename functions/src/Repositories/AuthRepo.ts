import Firestore from "../Firestore";

export default class AuthRepo extends Firestore {
    private static _instance?: AuthRepo = undefined;
    private constructor() { super(); }

    public static get Instance(): AuthRepo {
        if (this._instance === undefined) this._instance = new this();
        return (this._instance);
    }

    public async userLogin(email: string, password: string): Promise<{uid : string}> {
        const cred = await super.userLogin(email, password);
        return (JSON.parse(JSON.stringify(cred)));
    }

    public async userSignUp(email: string, password: string): Promise<any> {
        const cred: {} = await super.userSignUp(email, password);
        return (JSON.parse(JSON.stringify(cred)));
    }

    public async checkIfEmailExists(email: string): Promise<boolean> {
        return (super.checkIfEmailExists(email));
    }

    public async checkUserByBuildingId(buildingId: string, email: string, flatNo: string): Promise<boolean> {
        const ifExists: boolean = await super.checkUserByBuildingId(buildingId, email, flatNo);
        return (ifExists);
    }
    public async addUserToAuthData(uid: string, buildingId: string, flatId: string): Promise<void> {
        await super.addUserToAuthData(uid, buildingId, flatId);
    }

    public async createNewUserDoc(uid: string, email: string, buildingId: string, flatId: string): Promise<boolean> {
        return await super.createNewUserDoc(uid, email, buildingId, flatId);
    }

    public async getAuthDataByUid(uid: string): Promise<{}> {
        return await super.getAuthDataByUid(uid);
    }
}