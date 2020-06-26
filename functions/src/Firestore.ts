import * as admin from 'firebase-admin';
const serviceAccount = require('./Secret/service.json');
import fire from './FirebaseAuth';
//* This allows me to access the cloud firestore from this app
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://blick-88757.firebaseio.com"
});

export default abstract class Firestore implements Database {
    //* This is the variable that is the connect to the firebase database
    private db: FirebaseFirestore.Firestore;

    constructor() {
        this.db = admin.firestore();
    }

    public async getAllUsersByBuilding(buildingId: string): Promise<Array<{}>> {
        const data = await this.db.collection('society').get();
        console.log(data);
        return ([]);
    };
    public async getUserByFlatNumber(flatN0: number): Promise<{}>{
        const data = await this.db.collection('society').doc('user').get();
        console.log(data);
        return ({});
    };

    public async getUserDataByUid(uid: string): Promise<{}>{
        const userDocRef = await this.db.collection('users').doc(uid).get();
        const userData = userDocRef.data();
        if (userData === undefined) throw Error('Server Error');
        return (userData);
    };

    public async userLogin(email: string, password: string): Promise<{}>{
        try {
            const token: {} = await fire.auth().signInWithEmailAndPassword(email, password);
            return (token);
        }
        catch (error) {
            return (Promise.reject(error.message));
        }
    };

    public async userSignUp(email: string, password: string): Promise<any> {
        try {
            const cred: {} = await fire.auth().createUserWithEmailAndPassword(email, password);
            return (cred);
        }
        catch (error) {
            console.table({ log: 'Inside Firestore error' });
            return Promise.reject('Authentication Failed');
        }
    };

    // This just checks is the user exists in our database or not
    public async checkIfEmailExists(email: string): Promise<boolean> {
        try {
            const userDoc = await admin.auth().getUserByEmail(email);
            console.log(JSON.stringify(userDoc));
            return (true);
        }
        catch (error) {
            return (false);
        }
    };

    public async createNewUserDoc(uid: string, email: string): Promise<boolean> {
        try {
            this.db.collection('users').doc(uid).set({ email: email });
            return (true);
        }
        catch (error) {
            return (false);
        }
    };

    public async checkUserByBuildingId(buildingId: string, email: string, flatNo: string): Promise<boolean> {
        const buildingDocRef = await this.db.collection('buildings').doc(buildingId).get();
        if (!buildingDocRef.exists) return Promise.reject(new Error('Building Not Registered'));

        const flatDocRef = await this.db.collection('buildings').doc(buildingId).collection('flat_numbers').doc(flatNo).get();
        // Brand New user Register a new admin_user for the flat and send the notification to the building admin
        if (!flatDocRef.exists) return (false);

        // Flat already exists that means there is already a root user so then send the notification to the flat admin_user
        const flatUserData = flatDocRef.data();
        if (flatUserData === undefined) return Promise.reject('Server Error');
        if (flatUserData.admin_user.auth_status !== 'verified') return Promise.reject('The admin user is not verified, Contact the building Admin');
        // Now this user can be registered as a secondary_user
        return (true);
    };

    public async addUserToFlat(buildingId: string, flatNo: string, email: string): Promise<void>{
        const flatDocRef = await this.db.collection('buildings').doc(buildingId).collection('flat_numbers').doc(flatNo).get();
        if (flatDocRef.exists) {
            const snapshot = flatDocRef.data();
            if (snapshot === undefined) throw new Error('Server Error');
            snapshot.secondary_users.push({ email: email, auth_status: 'pending' });
            await this.db.collection('buildings').doc(buildingId).collection('flat_numbers').doc(flatNo).update({ secondary_users: snapshot.secondary_users });
        }
        else await this.db.collection('buildings').doc(buildingId).collection('flat_numbers').doc(flatNo).set({ admin_user: { email: email, auth_status: 'verified' }, secondary_users: [] });
    };
}