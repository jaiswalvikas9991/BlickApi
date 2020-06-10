import * as admin from 'firebase-admin';
const serviceAccount = require('./Secret/service.json');
import fire from './FirebaseAuth';
//* This allows me to access the cloud firestore from this app
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://blick-88757.firebaseio.com"
});

export default class Firestore implements Database {
    private static _instance: Database;
    //* This is the variable that is the connect to the firebase database
    public db: FirebaseFirestore.Firestore;

    private constructor() {
        this.db = admin.firestore();
    }
    public static get Instance(): Database {
        return this._instance || (this._instance = new this());
    }

    public getAllUsersByBuilding = async (buildingId: string): Promise<Array<{}>> => {
        const data = await this.db.collection('society').get();
        console.log(data);
        return ([]);
    };
    public getUserByFlatNumber = async (flatN0: number): Promise<{}> => {
        const data = await this.db.collection('society').doc('user').get();
        console.log(data);
        return ({});
    };

    public getOneUserByEmail = async (email: string): Promise<{}> => {
        return ({});
    };

    public userLogin = async (email: string, password: string): Promise<{}> => {
        try {
            const tocken: {} = await fire.auth().signInWithEmailAndPassword(email, password);
            return (tocken);
        }
        catch (error) {
            return (Promise.reject(error.message));
        }
    };

    public userSignUp = async (email: string, password: string): Promise<any> => {
        try {
            const cred: {} = await fire.auth().createUserWithEmailAndPassword(email, password);
            //await this.createNewUser(cred.);
            return (cred);
        }
        catch (error) {
            return (Promise.reject('Autentication Failer'));
        }
    };

    public checkIfEmailExists = async (email: string): Promise<boolean> => {
        try {
            await admin.auth().getUserByEmail(email);
            return(true);
        }
        catch (error) {
            return(false);
        }
    };

    public createNewUser = async (uid : string) : Promise<boolean> => {
        try{
            this.db.collection('users').doc(uid);
            return(true);
        }
        catch(error) {
            return(false);
        }
    }

}