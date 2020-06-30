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

    public async getBuildingInfoById(id: string): Promise<{}> {
        const docRef = await this.db.collection('buildings').doc(id).get();
        if (!docRef.exists) throw new Error('Building Not registered');
        const buildingData = docRef.data();
        if (buildingData === undefined) throw new Error('Server Error');
        return (buildingData);
    }

    public async getUserByFlatNumber(flatId: number): Promise<{}> {
        const data = await this.db.collection('society').doc('user').get();
        console.log(data);
        return ({});
    };

    public async getUserDataByUid(uid: string): Promise<{}> {
        const userDocRef = await this.db.collection('users').doc(uid).get();
        if (!userDocRef.exists) throw Error('User Data Does not Exist');
        const userData = userDocRef.data();
        if (userData === undefined) throw Error('Server Error');
        return (userData);
    };

    public async userLogin(email: string, password: string): Promise<{}> {
        try {
            const cred = await fire.auth().signInWithEmailAndPassword(email, password);
            return (cred);
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

    public async createNewUserDoc(uid: string, email: string, buildingId: string, flatId: string): Promise<boolean> {
        try {
            this.db.collection('users').doc(uid).set({ email: email, building_id: buildingId, flat_id: flatId });
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

    public async addUserToFlat(buildingId: string, flatNo: string, email: string): Promise<void> {
        const flatDocRef = await this.db.collection('buildings').doc(buildingId).collection('flat_numbers').doc(flatNo).get();
        if (flatDocRef.exists) {
            const snapshot = flatDocRef.data();
            if (snapshot === undefined) throw new Error('Server Error');
            snapshot.secondary_users.push({ email: email, auth_status: 'pending' });
            await this.db.collection('buildings').doc(buildingId).collection('flat_numbers').doc(flatNo).update({ secondary_users: snapshot.secondary_users });
        }
        else await this.db.collection('buildings').doc(buildingId).collection('flat_numbers').doc(flatNo).set({ admin_user: { email: email, auth_status: 'verified' }, secondary_users: [] });
    };

    public async addUserToAuthData(uid: string, buildingId: string, flatId: string): Promise<void> {
        try {
            await this.db.collection('auth_data').doc(uid).set({ building_id: buildingId, flat_id: flatId });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    public async getAuthDataByUid(uid: string): Promise<{}> {
        try {
            const docRef = await this.db.collection('auth_data').doc(uid).get();
            if (!docRef.exists) throw new Error('User Does not Exists');
            const data = docRef.data();
            if (data === undefined) throw Error('No User Data');
            return (data);
        }
        catch (error) {
            throw new Error('Server Error');
        }
    }

    public async getUsersInfoByFlat(buildingId: string, flatId: string): Promise<{}> {
        try {
            const docRef = await this.db.collection('buildings').doc(buildingId).collection('flat_numbers').doc(flatId).get();
            const data = docRef.data();
            if (!docRef.exists || data === undefined) throw new Error('No user From the Flat Exists');
            return (data);
        }
        catch (error) {
            throw new Error('Server Error');
        }
    }

    public async checkIfGuestsExists(uid: string, carNumber: string): Promise<boolean> {
        const docRef = await this.db.collection('users').doc(uid).get();
        if (!docRef.exists) throw new Error('User Does Not Exists');
        const data = docRef.data();
        if (data === undefined) throw new Error('Server Error');
        const guests: { car_number: string }[] = data.guests;
        if (guests === undefined) return (false);
        for (let i: number = 0; i < guests.length; i++) if (guests[i].car_number === carNumber) return (true);
        return (false);
    }

    public async addGuestByUser(uid: string, carNumber: string): Promise<boolean> {
        try {
            const ifGuestsExists = await this.checkIfGuestsExists(uid, carNumber);
            if (ifGuestsExists) throw new Error('Guests Already Exists');
            await this.db.collection('users').doc(uid).update({
                guests: admin.firestore.FieldValue.arrayUnion({ car_number: carNumber, created_on: new Date().toISOString(), end_time: new Date(new Date().getDay() + 1).toISOString() })
            });
            return (true);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}