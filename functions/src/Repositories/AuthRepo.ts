import Firestore from "../Firestore";

export default class AuthRepo extends Firestore {
    private static _instance?: AuthRepo = undefined;
    private constructor() { super(); }

    public static get Instance(): AuthRepo {
        if (this._instance === undefined) this._instance = new this();
        return (this._instance);
    }

    public async userLogin(email: string, password: string): Promise<{}> {
        try {
            const token: {} = await super.userLogin(email, password);
            return (token);
        }
        catch (error) {
            return (Promise.reject(error.message));
        }
    };

    public async userSignUp(email: string, password: string): Promise<any> {
        console.table({ email: email, password: password });
        try {
            const cred: {} = await super.userSignUp(email, password);
            return (cred);
        }
        catch (error) {
            console.table({ log: 'Inside AuthRepo error' });
            return Promise.reject('hello world');
        }
    };

    public async checkIfEmailExists(email: string): Promise<boolean> {
        return(super.checkIfEmailExists(email));
    };

    public async checkUserByBuildingId(buildingId: string, email: string, flatNo: string): Promise<boolean> {
        try {
            const ifExists: boolean = await super.checkUserByBuildingId(buildingId, email, flatNo);
            return (ifExists);
        }
        catch (error) {
            return Promise.reject(new Error(error.message));
        }
    };
}